import { useState } from 'react'
import { X, Undo2, Trophy } from 'lucide-react'
import { useDraft } from '../hooks/useDraft'

export default function DraftRoom({ isAdmin, onClose }) {
  const {
    draft, startDraft, makePick, undoPick,
    availablePlayers, currentTeam, currentCaptain,
    pickRound, isComplete, TOTAL_PICKS,
  } = useDraft()

  const [confirming, setConfirming] = useState(null)

  function handleConfirm() {
    if (!confirming) return
    makePick(confirming.name)
    setConfirming(null)
  }

  const teamColor = currentTeam === 'ca' ? '#C8102E' : '#003DA5'
  const captainFirst = currentCaptain?.split(' ')[0]?.toUpperCase()

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 70%)' }}
    >
      {/* Header */}
      <div className="w-full max-w-[430px] mx-auto flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
        <h2 className="text-[15px] font-bold tracking-[0.15em] uppercase text-accent-warm">
          Draft Room
        </h2>
        <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary transition-colors">
          <X size={22} />
        </button>
      </div>

      {/* Waiting state */}
      {draft.status === 'waiting' && (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[430px] mx-auto px-5">
          <Trophy size={48} className="text-accent-warm mb-4" />
          <h3 className="text-[20px] font-bold text-text-primary mb-2">Draft Night</h3>
          <p className="text-[14px] text-text-secondary text-center mb-8">
            23 players. 2 captains. Snake draft.
          </p>
          {isAdmin ? (
            <button
              onClick={startDraft}
              className="rounded-xl px-8 py-3.5 bg-accent-warm text-bg-primary font-bold text-[14px] tracking-wider uppercase transition-opacity hover:opacity-90"
            >
              Start Draft
            </button>
          ) : (
            <p className="text-[13px] text-text-muted">Waiting for admin to start...</p>
          )}
        </div>
      )}

      {/* Active draft */}
      {draft.status === 'active' && (
        <div
          className="flex-1 overflow-y-auto w-full max-w-[430px] mx-auto px-5 pb-20"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Current pick header */}
          <div className="text-center mb-4 animate-fade-in" key={draft.currentPick}>
            <p
              className="text-[22px] font-[800] tracking-[0.1em] uppercase"
              style={{ color: teamColor }}
            >
              {captainFirst}'S PICK
            </p>
            <p className="text-[12px] text-text-muted tracking-wider uppercase mt-1">
              Pick {draft.currentPick} of {TOTAL_PICKS} · Round {pickRound}
            </p>
          </div>

          {/* Team rosters */}
          <div className="flex gap-2 mb-5 w-full min-w-0">
            <RosterColumn label="CA" color="#C8102E" players={draft.caRoster} />
            <RosterColumn label="PDX" color="#003DA5" players={draft.pdxRoster} />
          </div>

          {/* Available players */}
          <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-text-muted mb-2">
            Available ({availablePlayers.length})
          </p>
          <div className="grid grid-cols-2 gap-1.5 mb-4 w-full">
            {availablePlayers.map((player) => (
              <button
                key={player.name}
                onClick={() => isAdmin && setConfirming(player)}
                disabled={!isAdmin}
                className="rounded-xl px-3 py-2.5 text-left transition-all active:scale-[0.97] disabled:opacity-60 min-w-0"
                style={{
                  background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
                  border: '1px solid #2A2A2E',
                }}
              >
                <span className="block text-[13px] font-medium text-text-primary truncate">
                  {player.name}
                </span>
                <span className="text-[10px] text-text-muted">{player.handicap != null ? `HCP ${player.handicap < 0 ? '+' + Math.abs(player.handicap) : player.handicap}` : 'HCP TBD'}</span>
              </button>
            ))}
          </div>

          {/* Undo button */}
          {isAdmin && draft.picks.length > 0 && (
            <button
              onClick={undoPick}
              className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2 text-[12px] font-medium uppercase tracking-wider text-text-muted border border-surface-border hover:border-team-red/40 hover:text-team-red transition-colors mb-4"
            >
              <Undo2 size={14} />
              Undo Last Pick
            </button>
          )}
        </div>
      )}

      {/* Draft complete */}
      {isComplete && (
        <div
          className="flex-1 overflow-y-auto w-full max-w-[430px] mx-auto px-5 pb-20"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="text-center py-8">
            <div className="text-[48px] mb-3">🏁</div>
            <h3 className="text-[22px] font-[800] tracking-[0.15em] uppercase text-accent-warm mb-2">
              Teams Are Set
            </h3>
            <p className="text-[14px] text-text-secondary mb-6">
              {TOTAL_PICKS} picks complete. Let the games begin.
            </p>
          </div>

          <div className="flex gap-2 mb-6 w-full min-w-0">
            <RosterColumn label="CA" color="#C8102E" players={draft.caRoster} />
            <RosterColumn label="PDX" color="#003DA5" players={draft.pdxRoster} />
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-xl py-3 bg-accent-warm text-bg-primary font-bold text-[14px] tracking-wider uppercase transition-opacity hover:opacity-90"
          >
            Back to Tournament
          </button>
        </div>
      )}

      {/* Confirm pick modal */}
      {confirming && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <div
            className="rounded-2xl px-6 py-6 w-full max-w-[340px]"
            style={{
              background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
              border: `2px solid ${teamColor}`,
            }}
          >
            <p className="text-[16px] font-bold text-text-primary text-center mb-1">
              Draft {confirming.name}?
            </p>
            <p className="text-[13px] text-text-muted text-center mb-5">
              Pick {draft.currentPick} for{' '}
              <span className="font-bold" style={{ color: teamColor }}>
                {currentTeam === 'ca' ? 'CA' : 'PDX'}
              </span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(null)}
                className="flex-1 rounded-xl py-2.5 text-[13px] font-semibold text-text-muted border border-surface-border"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-xl py-2.5 text-[13px] font-bold text-white"
                style={{ backgroundColor: teamColor }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spectator banner */}
      {!isAdmin && draft.status === 'active' && (
        <div className="fixed bottom-0 left-0 right-0 bg-bg-secondary/95 backdrop-blur-sm border-t border-surface-border shrink-0">
          <div className="max-w-[430px] mx-auto px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
            <p className="text-[12px] text-text-muted text-center tracking-wider uppercase">
              Spectator Mode — Watching Live
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function RosterColumn({ label, color, players }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="text-[12px] font-bold tracking-[0.1em] uppercase" style={{ color }}>
          {label}
        </span>
        <span className="text-[11px] text-text-muted">{players.length}</span>
      </div>
      <div
        className="rounded-xl overflow-hidden min-h-[80px]"
        style={{
          background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
          border: '1px solid #2A2A2E',
          borderLeftWidth: 3,
          borderLeftColor: color,
        }}
      >
        {players.map((name, i) => (
          <div
            key={name}
            className={`px-3 py-2 ${i !== players.length - 1 ? 'border-b border-surface-border' : ''} ${
              i === players.length - 1 && players.length > 1 ? 'animate-fade-in' : ''
            }`}
          >
            <span className="text-[12px] font-medium text-text-primary truncate block">
              {i === 0 ? '👑 ' : ''}{name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
