import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'
import { awardCategories, players, rounds } from '../data/mockData'

function getWinners() {
  const results = []
  const completedRounds = rounds.filter(r => r.status === 'complete')

  for (const round of completedRounds) {
    const closed = localStorage.getItem(`rallyAwardsClosed_${round.id}`) === 'true'
    let tallies = {}
    try {
      tallies = JSON.parse(localStorage.getItem(`rallyTallies_${round.id}`)) || {}
    } catch { /* empty */ }

    for (const category of awardCategories) {
      const catTallies = tallies[category] || {}
      const entries = Object.entries(catTallies).filter(([, v]) => v > 0)
      if (entries.length === 0) continue

      entries.sort((a, b) => b[1] - a[1])
      const [name, votes] = entries[0]
      const player = players.find(p => p.name === name)

      results.push({
        roundId: round.id,
        category,
        winner: name,
        votes,
        team: player?.team || 'ca',
        closed,
      })
    }
  }

  return results
}

export default function AwardWinners() {
  const [winners, setWinners] = useState(getWinners)

  // Refresh when component mounts (in case votes changed on another tab)
  useEffect(() => {
    setWinners(getWinners())
  }, [])

  if (winners.length === 0) return null

  // Group by round
  const byRound = {}
  for (const w of winners) {
    if (!byRound[w.roundId]) byRound[w.roundId] = []
    byRound[w.roundId].push(w)
  }

  return (
    <div className="mx-5 mb-4">
      {Object.entries(byRound).map(([roundId, awards]) => (
        <div key={roundId} className="mb-3">
          <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-text-muted mb-1.5">
            Round {roundId}
          </p>
          <div className="space-y-1.5">
            {awards.map((award) => {
              const teamColor = award.team === 'ca' ? '#C8102E' : '#003DA5'
              const firstName = award.winner.split(' ')[0]

              return (
                <div
                  key={`${roundId}-${award.category}`}
                  className="rounded-xl px-3.5 py-2.5 flex items-center gap-3"
                  style={{
                    background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.3)',
                    border: '1px solid #2A2A2E',
                    borderLeftWidth: 3,
                    borderLeftColor: teamColor,
                  }}
                >
                  <Trophy size={14} className="text-accent-warm shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-text-primary truncate">
                      {firstName}
                    </p>
                    <p className="text-[11px] text-text-muted">{award.category}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    award.closed ? 'text-accent-warm' : 'text-text-muted'
                  }`}>
                    {award.closed ? 'Winner' : `${award.votes} votes`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
