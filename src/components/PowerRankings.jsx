import { useMemo } from 'react'
import { Trophy, TrendingUp, Star, Users } from 'lucide-react'
import { players } from '../data/mockData'
import { useTournamentStats } from '../hooks/useTournamentStats'
import { useDraft } from '../hooks/useDraft'

// Quick handicap lookup by full name
const HANDICAP_BY_NAME = Object.fromEntries(
  players.map((p) => [p.name, p.handicap]),
)

// Resolve a player's team from the live draft rosters. mockData has team=null
// for everyone except the two captains, so the hook's byPlayer[name].team is
// stale — draft state is authoritative.
function buildTeamLookup(draft) {
  const map = {}
  for (const n of draft?.caRoster || []) map[n] = 'ca'
  for (const n of draft?.pdxRoster || []) map[n] = 'pdx'
  return map
}

// Derive ranking categories from the aggregated stats.
function computeRankings(byPlayer, byMatch, teamByName) {
  const teamOf = (name) => teamByName[name] || byPlayer[name]?.team || null
  // ── MVP: 3*W + 1*D, ties broken by wins desc, then matchesPlayed asc ──
  const mvpScores = Object.values(byPlayer)
    .map((p) => ({
      ...p,
      team: teamOf(p.name),
      mvpScore: p.wins * 3 + p.draws * 1,
    }))
    .filter((p) => p.mvpScore > 0)
    .sort((a, b) => (
      (b.mvpScore - a.mvpScore) ||
      (b.wins - a.wins) ||
      (a.matchesPlayed - b.matchesPlayed)
    ))

  // ── Clutch: 1UP and 2UP wins across all rounds ──
  // Both players on 2-man winning sides get credited.
  const clutchPlayers = []
  const finalizedMatches = Object.values(byMatch)
    .filter((m) => m.isFinal && !m.isHalved)
    .filter((m) => m.decisiveMargin === 1 || m.decisiveMargin === 2)
    .sort((a, b) => (
      (a.decisiveMargin - b.decisiveMargin) || // 1UP first
      (a.roundId - b.roundId) ||               // then earliest round
      (a.matchNum - b.matchNum)
    ))
  for (const m of finalizedMatches) {
    for (const winnerName of m.winners) {
      clutchPlayers.push({
        name: winnerName,
        team: teamOf(winnerName) || m.winningTeam,
        status: m.status,
        margin: m.decisiveMargin,
      })
    }
  }

  // ── Biggest Upset: higher-handicap winner beating lower-handicap loser ──
  // Plus-handicaps stored as negatives (e.g. Joseph Kim -2.0); the
  // `winner.hcp > loser.hcp` comparison still works correctly.
  const upsets = []
  for (const m of Object.values(byMatch)) {
    if (!m.isFinal || m.isHalved) continue
    for (const wName of m.winners) {
      const wHcp = HANDICAP_BY_NAME[wName]
      if (wHcp == null) continue
      for (const lName of m.losers) {
        const lHcp = HANDICAP_BY_NAME[lName]
        if (lHcp == null) continue
        if (wHcp > lHcp) {
          upsets.push({
            winner: wName,
            winnerTeam: teamOf(wName),
            loser: lName,
            hcpDiff: Math.round((wHcp - lHcp) * 10) / 10,
            round: m.roundId,
          })
        }
      }
    }
  }
  upsets.sort((a, b) => b.hcpDiff - a.hcpDiff)

  // ── Best Duo: most pairing wins together (2-man side experiences) ──
  // pairings already excludes singles by construction in the hook.
  const duoWins = {}
  for (const p of Object.values(byPlayer)) {
    for (const pair of p.pairings) {
      if (pair.result !== 'win') continue
      // Stable key from sorted pair of names; counts each match once
      // since both partners contribute the same key.
      const key = [p.name, pair.partner].sort().join(' & ')
      if (!duoWins[key]) {
        duoWins[key] = {
          names: key,
          team: teamOf(p.name) || p.team,
          wins: 0,
        }
      }
      duoWins[key].wins += 1
    }
  }
  // Each pairing-win gets counted twice (once from each partner's perspective)
  // — divide by 2 so wins reflects matches, not player-credits.
  for (const d of Object.values(duoWins)) d.wins /= 2
  const bestDuos = Object.values(duoWins).sort((a, b) => b.wins - a.wins)

  return { mvpScores, clutchPlayers, upsets, bestDuos }
}

export default function PowerRankings() {
  const { byPlayer, byMatch, byTeam } = useTournamentStats()
  const { draft } = useDraft()
  const totalMatchesPlayed = byTeam.ca.matchesPlayed + byTeam.pdx.matchesPlayed
  const teamByName = useMemo(() => buildTeamLookup(draft), [draft])
  const { mvpScores, clutchPlayers, upsets, bestDuos } = useMemo(
    () => computeRankings(byPlayer, byMatch, teamByName),
    [byPlayer, byMatch, teamByName],
  )

  return (
    <div className="space-y-5">
      {/* MVP Rankings */}
      {mvpScores.length > 0 && (
        <RankingSection icon={Trophy} title="MVP Rankings" subtitle="3pts per win, 1pt per draw">
          {mvpScores.slice(0, 8).map((p, i) => (
            <RankRow key={p.name} rank={i + 1} name={p.name} team={p.team} stat={`${p.mvpScore} pts`} />
          ))}
        </RankingSection>
      )}

      {/* Clutch Rating */}
      {clutchPlayers.length > 0 && (
        <RankingSection icon={TrendingUp} title="Clutch Rating" subtitle="Won 1UP or 2UP — held nerve in tight finishes">
          {clutchPlayers.slice(0, 5).map((p, i) => (
            <RankRow key={`${p.name}-${i}`} rank={i + 1} name={p.name} team={p.team} stat={p.status} />
          ))}
        </RankingSection>
      )}

      {/* Biggest Upset */}
      {upsets.length > 0 && (
        <RankingSection icon={Star} title="Biggest Upset" subtitle="Higher HCP beating lower HCP">
          {upsets.slice(0, 3).map((u, i) => (
            <div
              key={`upset-${i}`}
              className="flex items-center px-3.5 py-2.5 border-b border-surface-border last:border-0"
            >
              <span className="w-2 h-2 rounded-full mr-2.5 shrink-0"
                style={{ backgroundColor: u.winnerTeam === 'ca' ? '#C8102E' : '#003DA5' }} />
              <span className="flex-1 text-[13px] text-text-primary truncate">
                {u.winner.split(' ')[0]}
              </span>
              <span className="text-[11px] text-text-muted mr-2">
                beat {u.loser.split(' ')[0]}
              </span>
              <span className="text-[12px] font-semibold text-accent-warm">
                +{u.hcpDiff} HCP
              </span>
            </div>
          ))}
        </RankingSection>
      )}

      {/* Best Duo */}
      {bestDuos.length > 0 && (
        <RankingSection icon={Users} title="Best Duo" subtitle="Team match wins together">
          {bestDuos.slice(0, 3).map((d, i) => (
            <div
              key={`duo-${i}`}
              className="flex items-center px-3.5 py-2.5 border-b border-surface-border last:border-0"
            >
              <span className="w-2 h-2 rounded-full mr-2.5 shrink-0"
                style={{ backgroundColor: d.team === 'ca' ? '#C8102E' : '#003DA5' }} />
              <span className="flex-1 text-[13px] text-text-primary truncate">
                {d.names}
              </span>
              <span className="text-[12px] font-semibold text-accent-warm">
                {d.wins}W
              </span>
            </div>
          ))}
        </RankingSection>
      )}

      {totalMatchesPlayed === 0 && (
        <p className="text-[13px] text-text-muted text-center py-6 mx-5">
          Rankings will appear once matches are played
        </p>
      )}
    </div>
  )
}

function RankingSection({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="mx-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-accent-warm" />
        <span className="text-[13px] font-bold tracking-[0.1em] uppercase text-text-primary">{title}</span>
      </div>
      {subtitle && (
        <p className="text-[11px] text-text-muted mb-2">{subtitle}</p>
      )}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.3)',
          border: '1px solid #2A2A2E',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function RankRow({ rank, name, team, stat }) {
  const teamColor = team === 'ca' ? '#C8102E' : team === 'pdx' ? '#003DA5' : '#6B7280'
  return (
    <div className="flex items-center px-3.5 py-2.5 border-b border-surface-border last:border-0">
      <span className="text-[12px] text-text-muted w-5 tabular-nums font-medium">{rank}</span>
      <span className="w-2 h-2 rounded-full mr-2.5 shrink-0" style={{ backgroundColor: teamColor }} />
      <span className="flex-1 text-[13px] font-medium text-text-primary truncate">
        {name.split(' ')[0]}
      </span>
      <span className="text-[12px] font-semibold tabular-nums text-accent-warm">{stat}</span>
    </div>
  )
}
