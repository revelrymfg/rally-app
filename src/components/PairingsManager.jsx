import { useState } from 'react'
import { X, Plus, Trash2, Lock, Unlock, Users, User } from 'lucide-react'
import { useDraft } from '../hooks/useDraft'
import { useMatches, ROUND_INFO, getRoundInfo } from '../hooks/useMatches'
import { playerShortNames } from '../data/mockData'

function shortName(fullName) {
  return playerShortNames[fullName] || fullName.split(' ')[0]
}

// Per-match team size is the length of the teamA array.
// Rounds 1-2 can have either 1 or 2 per side. Round 3 is always 1.
function getMatchTeamSize(match) {
  return (match.teamA && match.teamA.length) || 0
}

export default function PairingsManager({ onClose }) {
  const { draft } = useDraft()
  const { matchesByRound, saveMatch, deleteMatch, setRoundPublished } = useMatches()
  const [activeRound, setActiveRound] = useState(1)
  const [pickerSlot, setPickerSlot] = useState(null)

  const roundInfo = getRoundInfo(activeRound)
  const roundMatches = matchesByRound(activeRound)
  const published = roundMatches.length > 0 && roundMatches.every((m) => m.published)

  const caRoster = draft?.caRoster || []
  const pdxRoster = draft?.pdxRoster || []

  // Players already assigned in this round (to prevent duplicates)
  const assignedInRound = new Set()
  for (const m of roundMatches) {
    for (const p of m.teamA || []) if (p) assignedInRound.add(p)
    for (const p of m.teamB || []) if (p) assignedInRound.add(p)
  }

  async function handleAddMatch() {
    const nextNum = roundMatches.length + 1
    await saveMatch({
      roundId: activeRound,
      matchNum: nextNum,
      teamA: Array(roundInfo.teamSize).fill(null),
      teamB: Array(roundInfo.teamSize).fill(null),
      status: '-',
      thru: '-',
      leadingTeam: null,
      published: false,
    })
  }

  async function handleDeleteMatch(matchNum) {
    await deleteMatch(activeRound, matchNum)
  }

  async function handleSlotPick(fullName) {
    if (!pickerSlot) return
    const match = roundMatches.find((m) => m.matchNum === pickerSlot.matchNum)
    if (!match) return
    const key = pickerSlot.side === 'A' ? 'teamA' : 'teamB'
    const team = [...(match[key] || [])]
    team[pickerSlot.idx] = fullName
    await saveMatch({ ...match, [key]: team })
    setPickerSlot(null)
  }

  async function handleClearSlot(matchNum, side, idx) {
    const match = roundMatches.find((m) => m.matchNum === matchNum)
    if (!match) return
    const key = side === 'A' ? 'teamA' : 'teamB'
    const team = [...(match[key] || [])]
    team[idx] = null
    await saveMatch({ ...match, [key]: team })
  }

  // Toggle a match between 2v2 and 1v1 (rounds 1-2 only)
  async function handleToggleMatchType(matchNum) {
    const match = roundMatches.find((m) => m.matchNum === matchNum)
    if (!match) return
    const currentSize = getMatchTeamSize(match)
    const newSize = currentSize === 2 ? 1 : 2
    const resize = (arr) => {
      const next = [...(arr || [])]
      if (newSize < next.length) return next.slice(0, newSize)
      while (next.length < newSize) next.push(null)
      return next
    }
    await saveMatch({
      ...match,
      teamA: resize(match.teamA),
      teamB: resize(match.teamB),
    })
  }

  async function handlePublish() {
    await setRoundPublished(activeRound, true)
  }

  async function handleUnpublish() {
    await setRoundPublished(activeRound, false)
  }

  // Validate: every match has its teamA and teamB fully filled (size matches)
  const canPublish =
    roundMatches.length > 0 &&
    roundMatches.every((m) => {
      const sizeA = (m.teamA || []).length
      const sizeB = (m.teamB || []).length
      if (sizeA !== sizeB || sizeA === 0) return false
      const filledA = (m.teamA || []).filter(Boolean).length
      const filledB = (m.teamB || []).filter(Boolean).length
      return filledA === sizeA && filledB === sizeB
    })

  return (
    <div
      className="fixed inset-0 z-[110] flex flex-col"
      style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 70%)' }}
    >
      {/* Header */}
      <div
        className="w-full max-w-[430px] mx-auto flex items-center justify-between px-5 pb-2 shrink-0"
        style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top, 0px))' }}
      >
        <h2 className="text-[15px] font-bold tracking-[0.15em] uppercase text-accent-warm">
          Pairings Manager
        </h2>
        <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary">
          <X size={22} />
        </button>
      </div>

      {/* Round tabs */}
      <div className="w-full max-w-[430px] mx-auto px-5 mb-3 shrink-0">
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2E' }}>
          {ROUND_INFO.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRound(r.id)}
              className={`flex-1 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                activeRound === r.id ? 'bg-accent-warm/15 text-accent-warm' : 'text-text-muted'
              }`}
            >
              R{r.id}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-text-muted text-center mt-2 tracking-wider uppercase">
          {roundInfo.name}
        </p>
        {published && (
          <div className="mt-2 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent-warm">
              🔒 Published — visible to all players
            </span>
          </div>
        )}
      </div>

      {/* Match list */}
      <div className="flex-1 overflow-y-auto w-full max-w-[430px] mx-auto px-5 pb-32">
        {roundMatches.length === 0 ? (
          <p className="text-[13px] text-text-muted text-center py-6">
            No matches yet — tap "Add Match" below
          </p>
        ) : (
          roundMatches.map((m) => (
            <MatchBuilder
              key={m.id}
              match={m}
              roundInfo={roundInfo}
              disabled={published}
              onSlotClick={(side, idx) =>
                setPickerSlot({ matchNum: m.matchNum, side, idx, team: side === 'A' ? 'ca' : 'pdx' })
              }
              onSlotClear={(side, idx) => handleClearSlot(m.matchNum, side, idx)}
              onDelete={() => handleDeleteMatch(m.matchNum)}
              onToggleType={() => handleToggleMatchType(m.matchNum)}
            />
          ))
        )}

        {!published && (
          <button
            onClick={handleAddMatch}
            className="w-full mt-3 rounded-xl py-3 flex items-center justify-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-text-secondary border border-dashed border-surface-border hover:border-accent-warm/40 hover:text-accent-warm transition-colors"
          >
            <Plus size={16} />
            Add Match
          </button>
        )}
      </div>

      {/* Bottom bar: Publish */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-bg-secondary/95 backdrop-blur-sm border-t border-surface-border"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="max-w-[430px] mx-auto px-5 py-3">
          {published ? (
            <button
              onClick={handleUnpublish}
              className="w-full rounded-xl py-3 flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-wider text-team-red border border-team-red/40"
            >
              <Unlock size={16} />
              Unpublish to Edit
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={!canPublish}
              className="w-full rounded-xl py-3 flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-wider bg-accent-warm text-bg-primary disabled:opacity-30 transition-opacity"
            >
              <Lock size={16} />
              Publish Round {activeRound}
            </button>
          )}
        </div>
      </div>

      {/* Player picker */}
      {pickerSlot && (
        <PlayerPicker
          team={pickerSlot.team}
          roster={pickerSlot.team === 'ca' ? caRoster : pdxRoster}
          assigned={assignedInRound}
          onPick={handleSlotPick}
          onClose={() => setPickerSlot(null)}
        />
      )}
    </div>
  )
}

function MatchBuilder({ match, roundInfo, disabled, onSlotClick, onSlotClear, onDelete, onToggleType }) {
  const matchSize = getMatchTeamSize(match) || roundInfo.teamSize
  // Only rounds 1-2 support toggling between 2v2 and 1v1
  const canToggle = roundInfo.id !== 3 && !disabled
  const matchTypeLabel = matchSize === 2 ? '2v2 Match' : '1v1 Match'

  return (
    <div
      className="rounded-xl mb-3 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
        border: '1px solid #2A2A2E',
      }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Match {match.matchNum}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{
            background: matchSize === 2 ? 'rgba(200,16,46,0.12)' : 'rgba(194,184,163,0.12)',
            color: matchSize === 2 ? '#C8102E' : '#C2B8A3',
          }}>
            {matchTypeLabel}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {canToggle && (
            <button
              onClick={onToggleType}
              className="p-1.5 text-text-muted hover:text-accent-warm transition-colors"
              title={matchSize === 2 ? 'Switch to 1v1' : 'Switch to 2v2'}
            >
              {matchSize === 2 ? <User size={14} /> : <Users size={14} />}
            </button>
          )}
          {!disabled && (
            <button onClick={onDelete} className="p-1.5 text-text-muted hover:text-team-red">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
      <div className="p-3 space-y-2">
        {/* CA side */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-team-red mb-1.5">Drifters</p>
          <div className="space-y-1.5">
            {Array.from({ length: matchSize }).map((_, i) => (
              <PlayerSlot
                key={`a-${i}`}
                name={(match.teamA || [])[i]}
                teamColor="#C8102E"
                disabled={disabled}
                onClick={() => onSlotClick('A', i)}
                onClear={() => onSlotClear('A', i)}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center py-0.5">
          <span className="text-[10px] text-text-muted tracking-widest uppercase">vs</span>
        </div>
        {/* PDX side */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-team-blue mb-1.5">Grifters</p>
          <div className="space-y-1.5">
            {Array.from({ length: matchSize }).map((_, i) => (
              <PlayerSlot
                key={`b-${i}`}
                name={(match.teamB || [])[i]}
                teamColor="#003DA5"
                disabled={disabled}
                onClick={() => onSlotClick('B', i)}
                onClear={() => onSlotClear('B', i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PlayerSlot({ name, teamColor, disabled, onClick, onClear }) {
  if (!name) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full rounded-lg py-2 px-3 text-[12px] text-text-muted border border-dashed border-surface-border hover:border-accent-warm/40 transition-colors disabled:opacity-50 text-left"
      >
        Tap to select player
      </button>
    )
  }
  return (
    <div
      className="w-full rounded-lg py-2 px-3 flex items-center gap-2"
      style={{
        background: `${teamColor}10`,
        border: `1px solid ${teamColor}40`,
      }}
    >
      <span className="flex-1 text-[13px] font-medium text-text-primary truncate">
        {shortName(name)}
      </span>
      {!disabled && (
        <button onClick={onClear} className="p-0.5 text-text-muted hover:text-team-red">
          <X size={14} />
        </button>
      )}
    </div>
  )
}

function PlayerPicker({ team, roster, assigned, onPick, onClose }) {
  const color = team === 'ca' ? '#C8102E' : '#003DA5'
  const label = team === 'ca' ? 'Drifters' : 'Grifters'

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm px-5">
      <div
        className="w-full max-w-[340px] rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
          border: `2px solid ${color}`,
          maxHeight: '70vh',
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
          <span className="text-[13px] font-bold tracking-wider uppercase" style={{ color }}>
            Select {label} Player
          </span>
          <button onClick={onClose} className="text-text-muted">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-2">
          {roster.length === 0 ? (
            <p className="text-[12px] text-text-muted text-center py-4">
              No {label} roster — complete draft first
            </p>
          ) : (
            roster.map((name) => {
              const isAssigned = assigned.has(name)
              return (
                <button
                  key={name}
                  onClick={() => !isAssigned && onPick(name)}
                  disabled={isAssigned}
                  className="w-full rounded-lg px-3 py-2.5 mb-1 flex items-center justify-between text-left transition-colors disabled:opacity-40"
                  style={{
                    background: isAssigned ? 'transparent' : '#19191C',
                    border: '1px solid #2A2A2E',
                  }}
                >
                  <span className="text-[13px] text-text-primary truncate">{name}</span>
                  {isAssigned && (
                    <span className="text-[10px] text-text-muted uppercase tracking-wider">
                      Assigned
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
