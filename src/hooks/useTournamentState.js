import { useMatches, ROUND_INFO } from './useMatches'

// Tournament starts April 23, 2026 at 12:00pm Pacific
const TOURNAMENT_START = new Date('2026-04-23T12:00:00-07:00').getTime()

function isFinal(m) {
  return m.thru === 'F' || m.thru === 'FINAL'
}

function computeRoundProgress(roundId, allMatches) {
  const matches = allMatches.filter((m) => m.published && m.roundId === roundId)
  if (matches.length === 0) return { state: 'unscheduled', total: 0, finals: 0 }
  const finals = matches.filter(isFinal).length
  if (finals === matches.length) return { state: 'complete', total: matches.length, finals }
  if (finals > 0) return { state: 'in-progress', total: matches.length, finals }
  // Has pairings but no scores yet
  return { state: 'pending', total: matches.length, finals: 0 }
}

function dayForRound(roundId) {
  // R1 = Thu (Day 1), R2 + R3 = Fri (Day 2)
  return roundId === 1 ? 1 : 2
}

export function useTournamentState() {
  const { matches } = useMatches()

  // Compute scores from final published matches
  let ca = 0
  let pdx = 0
  for (const m of matches) {
    if (!m.published || !isFinal(m)) continue
    if (m.leadingTeam === 'ca') ca += 1
    else if (m.leadingTeam === 'pdx') pdx += 1
    else {
      // Halved / null leadingTeam after final → split point
      ca += 0.5
      pdx += 0.5
    }
  }

  // Determine current round + phase
  const tournamentStarted = Date.now() >= TOURNAMENT_START

  let currentRoundId = 1
  let phaseLabel = 'Pre-Tournament'

  if (tournamentStarted) {
    // Find the latest round that has activity (any published matches),
    // or the first round that's not yet complete.
    const r1 = computeRoundProgress(1, matches)
    const r2 = computeRoundProgress(2, matches)
    const r3 = computeRoundProgress(3, matches)
    const rounds = [
      { id: 1, ...r1 },
      { id: 2, ...r2 },
      { id: 3, ...r3 },
    ]

    // Active round = first non-complete round that has pairings, otherwise the
    // last round that has activity, otherwise R1
    const active =
      rounds.find((r) => r.state === 'in-progress') ||
      rounds.find((r) => r.state === 'pending') ||
      [...rounds].reverse().find((r) => r.state === 'complete') ||
      rounds[0]

    currentRoundId = active.id
    const stateLabel =
      active.state === 'complete' ? 'Complete' :
      active.state === 'in-progress' ? 'In Progress' :
      active.state === 'pending' ? 'Tee Times Set' :
      'Upcoming'
    phaseLabel = `Round ${active.id} ${stateLabel}`
  }

  return {
    scores: { ca, pdx },
    day: tournamentStarted ? dayForRound(currentRoundId) : 1,
    session: phaseLabel,
    started: tournamentStarted,
    currentRoundId,
  }
}
