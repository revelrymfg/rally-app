import { useMemo } from 'react'
import { useMatches } from './useMatches'
import { players } from '../data/mockData'

const FORMAT_BY_ROUND = {
  1: 'best-ball',
  2: 'scramble',
  3: 'singles',
}

function isFinal(m) {
  return m.thru === 'F' || m.thru === 'FINAL'
}

// Parse a match-play status string into { margin, holesRemaining }.
// "3&2" → 3 up with 2 to play (closed out on 16). "1UP" → 1 up after 18.
// "AS" / "HALVED" / "-" → 0 / null.
function parseStatus(status) {
  if (!status || status === '-' || status === 'AS' || status === 'HALVED') {
    return { margin: 0, holesRemaining: null }
  }
  const amp = /^(\d+)&(\d+)$/.exec(status)
  if (amp) return { margin: +amp[1], holesRemaining: +amp[2] }
  const up = /^(\d+)UP$/.exec(status)
  if (up) return { margin: +up[1], holesRemaining: 0 }
  const dn = /^(\d+)DN$/.exec(status)
  if (dn) return { margin: +dn[1], holesRemaining: 0 }
  return { margin: 0, holesRemaining: null }
}

/**
 * Pure aggregation function — derive per-player, per-match, and per-team
 * stats from an array of Firestore match docs.
 *
 * Rules:
 * - Only `published` matches contribute to byMatch entries.
 * - Only `published && isFinal` matches contribute to W/L/D and points.
 * - Halved (final with leadingTeam null OR status 'HALVED'/'AS') splits the
 *   point: each side gets +0.5, each player on each side gets +1 draw.
 * - 2-man matches credit BOTH players on each side equally (e.g. a 2v2 win
 *   for Drifters → both Drifter players get +1 win, both Grifter players
 *   get +1 loss).
 * - The 2v1 handicap match (r3-m12) credits all 3 players naturally:
 *   2-side gets entries in `pairings`, solo side in `singles`.
 *
 * Team `points` matches the canonical 1-pt-per-match math used in
 * useTournamentState (the source of truth for the 16-8 scoreboard).
 *
 * Invariants:
 * - byTeam.ca.matchWins + byTeam.pdx.matchWins + halves === total finalized
 * - byTeam.ca.points + byTeam.pdx.points === total finalized
 */
export function aggregateStats(matches) {
  const byPlayer = {}
  for (const p of players) {
    byPlayer[p.name] = {
      name: p.name,
      team: p.team,
      wins: 0,
      losses: 0,
      draws: 0,
      points: 0,
      matchesPlayed: 0,
      pairings: [], // 2-man side experiences
      singles: [],  // 1-man side experiences
    }
  }

  const byMatch = {}
  const byTeam = {
    ca: { points: 0, matchWins: 0, matchLosses: 0, matchHalves: 0, matchesPlayed: 0 },
    pdx: { points: 0, matchWins: 0, matchLosses: 0, matchHalves: 0, matchesPlayed: 0 },
  }

  for (const m of matches) {
    if (!m.published) continue

    const teamA = (m.teamA || []).filter(Boolean)
    const teamB = (m.teamB || []).filter(Boolean)
    const final = isFinal(m)
    const halved = final && (
      m.leadingTeam == null ||
      m.status === 'HALVED' ||
      m.status === 'AS'
    )
    const winningTeam = halved ? null : (m.leadingTeam || null)
    const losingTeam =
      winningTeam === 'ca' ? 'pdx' :
      winningTeam === 'pdx' ? 'ca' :
      null

    const winners = winningTeam === 'ca' ? teamA : winningTeam === 'pdx' ? teamB : []
    const losers = winningTeam === 'ca' ? teamB : winningTeam === 'pdx' ? teamA : []

    const { margin, holesRemaining } = parseStatus(m.status)
    const finalHole = (final && holesRemaining != null) ? 18 - holesRemaining : null

    byMatch[m.id] = {
      id: m.id,
      roundId: m.roundId,
      matchNum: m.matchNum,
      format: FORMAT_BY_ROUND[m.roundId] || 'unknown',
      teamA,
      teamB,
      winningTeam,
      losingTeam,
      isHalved: halved,
      isFinal: final,
      status: m.status,
      thru: m.thru,
      decisiveMargin: margin,
      decisiveScore: m.status,
      finalHole,
      winners,
      losers,
    }

    if (!final) continue

    // Team totals — 1 point per match, split for halves
    if (halved) {
      byTeam.ca.points += 0.5
      byTeam.pdx.points += 0.5
      byTeam.ca.matchHalves += 1
      byTeam.pdx.matchHalves += 1
    } else if (winningTeam) {
      byTeam[winningTeam].points += 1
      byTeam[winningTeam].matchWins += 1
      byTeam[losingTeam].matchLosses += 1
    }

    // Per-player accumulation
    function creditSide(sidePlayers, opposingPlayers, sideKey) {
      const sideSize = sidePlayers.length
      for (const name of sidePlayers) {
        const p = byPlayer[name]
        if (!p) continue
        p.matchesPlayed += 1
        if (halved) {
          p.draws += 1
          p.points += 0.5
        } else if (winningTeam === sideKey) {
          p.wins += 1
          p.points += 1
        } else {
          p.losses += 1
        }
        const partner = sideSize > 1 ? sidePlayers.find((n) => n !== name) : null
        const result = halved ? 'halve' : winningTeam === sideKey ? 'win' : 'loss'
        const entry = {
          matchId: m.id,
          round: m.roundId,
          opponents: [...opposingPlayers],
          result,
          status: m.status,
        }
        if (partner) {
          p.pairings.push({ ...entry, partner })
        } else {
          p.singles.push(entry)
        }
      }
    }
    creditSide(teamA, teamB, 'ca')
    creditSide(teamB, teamA, 'pdx')
  }

  byTeam.ca.matchesPlayed = byTeam.ca.matchWins + byTeam.ca.matchLosses + byTeam.ca.matchHalves
  byTeam.pdx.matchesPlayed = byTeam.pdx.matchWins + byTeam.pdx.matchLosses + byTeam.pdx.matchHalves

  return { byPlayer, byMatch, byTeam }
}

export function useTournamentStats() {
  const { matches } = useMatches()
  return useMemo(() => aggregateStats(matches), [matches])
}
