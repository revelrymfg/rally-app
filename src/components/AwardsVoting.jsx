import { Trophy, X } from 'lucide-react'
import { players, awardCategories } from '../data/mockData'
import { useVotes, useAwardsClosed } from '../hooks/useFirestore'

export default function AwardsVoting({ roundId, roundName, currentUser, onClose }) {
  const { tallies, getMyVotes, castVote } = useVotes(roundId)
  const { closed, closeVoting } = useAwardsClosed(roundId)

  const myVotes = getMyVotes(currentUser?.name)
  const votablePlayers = players.filter(p => p.name !== currentUser?.name)

  function handleVote(category, playerName) {
    if (closed) return
    castVote(category, currentUser?.name, playerName)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 70%)' }}
    >
      {/* Header */}
      <div className="max-w-[430px] w-full mx-auto flex items-center justify-between px-5 pt-6 pb-3">
        <div>
          <h2 className="text-[16px] font-bold tracking-[0.12em] uppercase text-accent-warm flex items-center gap-2">
            <Trophy size={18} className="text-accent-warm" />
            Round {roundId} Awards
          </h2>
          <p className="text-[12px] text-text-muted mt-0.5">{roundName}</p>
        </div>
        <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary transition-colors">
          <X size={22} />
        </button>
      </div>

      {closed && (
        <div className="max-w-[430px] w-full mx-auto px-5 mb-2">
          <div className="rounded-lg bg-accent-warm/10 border border-accent-warm/20 px-3 py-2 text-center">
            <span className="text-[12px] font-semibold text-accent-warm uppercase tracking-wider">
              Voting Closed — Winners Locked
            </span>
          </div>
        </div>
      )}

      {/* Scrollable categories */}
      <div className="flex-1 overflow-y-auto max-w-[430px] w-full mx-auto px-5 pb-24">
        {awardCategories.map((category) => {
          const catTallies = tallies[category] || {}
          const myPick = myVotes[category]

          return (
            <div key={category} className="mb-6">
              <h3 className="text-[14px] font-bold text-text-primary mb-2 tracking-wide">
                {category}
              </h3>
              <div className="space-y-1.5">
                {votablePlayers.map((player) => {
                  const votes = catTallies[player.name] || 0
                  const isSelected = myPick === player.name
                  const teamColor = player.team === 'ca' ? '#C8102E' : '#003DA5'

                  return (
                    <button
                      key={player.name}
                      onClick={() => handleVote(category, player.name)}
                      disabled={closed}
                      className="w-full rounded-xl px-3.5 py-2.5 flex items-center gap-3 transition-all active:scale-[0.98]"
                      style={{
                        background: isSelected
                          ? `linear-gradient(135deg, ${teamColor}22 0%, ${teamColor}11 100%)`
                          : 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
                        border: isSelected
                          ? `1.5px solid ${teamColor}`
                          : '1px solid #2A2A2E',
                        opacity: closed && !isSelected ? 0.5 : 1,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: teamColor }}
                      />
                      <span className="flex-1 text-left text-[13px] font-medium text-text-primary truncate">
                        {player.name}
                      </span>
                      {votes > 0 && (
                        <span className="text-[12px] font-semibold tabular-nums text-text-muted">
                          {votes}
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-warm">
                          Your pick
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Admin close button */}
        {!closed && (
          <button
            onClick={closeVoting}
            className="w-full rounded-xl py-3 mb-4 text-[13px] font-semibold uppercase tracking-wider text-text-muted border border-surface-border hover:border-accent-warm/40 hover:text-accent-warm transition-colors"
          >
            Close Voting for Round {roundId}
          </button>
        )}
      </div>

      {/* Done button */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-secondary/95 backdrop-blur-sm border-t border-surface-border">
        <div className="max-w-[430px] mx-auto px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
          <button
            onClick={onClose}
            className="w-full rounded-xl py-3 bg-accent-warm text-bg-primary font-bold text-[14px] tracking-wider uppercase transition-opacity hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
