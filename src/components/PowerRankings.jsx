import { Trophy, TrendingUp, Star, Users } from 'lucide-react'
import { players, rounds } from '../data/mockData'

function computeRankings() {
  // MVP Score: 3*W + 1*D
  const mvpScores = players.map(p => ({
    ...p,
    mvpScore: p.wins * 3 + p.draws * 1,
  })).sort((a, b) => b.mvpScore - a.mvpScore)

  // Clutch Rating: singles wins (Round 3)
  const singlesRound = rounds.find(r => r.name.includes('Singles'))
  const clutchPlayers = []
  if (singlesRound) {
    for (const m of singlesRound.matches) {
      if (m.leadingTeam && m.status !== 'AS') {
        const winnerTeam = m.leadingTeam === 'ca' ? m.teamA : m.teamB
        for (const name of winnerTeam) {
          const player = players.find(p =>
            p.name.startsWith(name.split('.')[0]) || p.name.split(' ')[0] === name
          )
          if (player) clutchPlayers.push({ name: player.name, team: player.team, status: m.status })
        }
      }
    }
  }

  // Biggest Upset: player who beat someone with lowest handicap
  const upsets = []
  for (const round of rounds) {
    for (const m of round.matches) {
      if (!m.leadingTeam || m.status === 'AS') continue
      const winners = m.leadingTeam === 'ca' ? m.teamA : m.teamB
      const losers = m.leadingTeam === 'ca' ? m.teamB : m.teamA
      // Find lowest HCP among losers
      for (const loserName of losers) {
        const loser = players.find(p => p.name.split(' ')[0] === loserName || p.name.startsWith(loserName.split('.')[0]))
        if (loser) {
          for (const winnerName of winners) {
            const winner = players.find(p => p.name.split(' ')[0] === winnerName || p.name.startsWith(winnerName.split('.')[0]))
            if (winner && winner.handicap > loser.handicap) {
              upsets.push({
                winner: winner.name,
                winnerTeam: winner.team,
                loser: loser.name,
                hcpDiff: winner.handicap - loser.handicap,
                round: round.id,
              })
            }
          }
        }
      }
    }
  }
  upsets.sort((a, b) => b.hcpDiff - a.hcpDiff)

  // Best Duo: most team wins together across four-ball/foursomes
  const duoWins = {}
  for (const round of rounds) {
    if (round.name.includes('Singles')) continue
    for (const m of round.matches) {
      if (!m.leadingTeam || m.status === 'AS') continue
      const winners = m.leadingTeam === 'ca' ? m.teamA : m.teamB
      if (winners.length === 2) {
        const key = winners.sort().join(' & ')
        const team = m.leadingTeam
        if (!duoWins[key]) duoWins[key] = { names: key, team, wins: 0 }
        duoWins[key].wins++
      }
    }
  }
  const bestDuos = Object.values(duoWins).sort((a, b) => b.wins - a.wins)

  return { mvpScores, clutchPlayers, upsets, bestDuos }
}

export default function PowerRankings() {
  const { mvpScores, clutchPlayers, upsets, bestDuos } = computeRankings()

  return (
    <div className="space-y-5">
      {/* MVP Rankings */}
      <RankingSection icon={Trophy} title="MVP Rankings" subtitle="3pts per win, 1pt per draw">
        {mvpScores.slice(0, 8).map((p, i) => (
          <RankRow key={p.name} rank={i + 1} name={p.name} team={p.team} stat={`${p.mvpScore} pts`} />
        ))}
      </RankingSection>

      {/* Clutch Rating */}
      {clutchPlayers.length > 0 && (
        <RankingSection icon={TrendingUp} title="Clutch Rating" subtitle="Singles match leaders">
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
  const teamColor = team === 'ca' ? '#C8102E' : '#003DA5'
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
