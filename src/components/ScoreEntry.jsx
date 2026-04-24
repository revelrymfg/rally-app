import { useState, useCallback, useMemo, useEffect } from 'react'
import { X, Check, Flag } from 'lucide-react'
import { useMatches } from '../hooks/useMatches'
import { playerShortNames } from '../data/mockData'

const TOTAL_HOLES = 18

function toShort(fullName) {
  return fullName == null ? '?' : (playerShortNames[fullName] || fullName.split(' ')[0])
}

// Compute match play status from hole winners
// Returns { status, thru, leadingTeam, caWins, pdxWins, holesPlayed, isFinal }
export function computeMatchStatus(holes = {}) {
  let caWins = 0
  let pdxWins = 0
  let holesPlayed = 0
  for (let i = 1; i <= TOTAL_HOLES; i++) {
    const w = holes[i]
    if (!w) continue
    holesPlayed++
    if (w === 'ca') caWins++
    else if (w === 'pdx') pdxWins++
  }
  const diff = caWins - pdxWins
  const remaining = TOTAL_HOLES - holesPlayed
  const absDiff = Math.abs(diff)

  const leadingTeam = diff === 0 ? null : diff > 0 ? 'ca' : 'pdx'

  // Match closed out when lead > remaining holes
  const isFinal = holesPlayed === TOTAL_HOLES || (holesPlayed > 0 && absDiff > remaining)

  let status
  if (holesPlayed === 0) {
    status = '-'
  } else if (diff === 0) {
    status = isFinal ? 'HALVED' : 'AS'
  } else if (isFinal && absDiff > remaining) {
    status = `${absDiff}&${remaining}`
  } else if (isFinal) {
    status = `${absDiff}UP`
  } else {
    status = `${absDiff}UP`
  }

  const thru = isFinal ? 'F' : holesPlayed

  return { status, thru, leadingTeam, caWins, pdxWins, holesPlayed, isFinal }
}

export default function ScoreEntry({ match, onClose }) {
  const { saveMatch } = useMatches()
  const [holes, setHoles] = useState(match.holes || {})
  const [saving, setSaving] = useState(false)

  // Lock background scroll while modal is open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    const prevPosition = document.body.style.position
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.position = prevPosition
    }
  }, [])

  // Keep local state in sync if the Firestore match doc updates externally
  // (e.g. another admin enters a score on their device)
  useEffect(() => {
    if (match.holes) setHoles(match.holes)
  }, [match.holes])

  const computed = useMemo(() => computeMatchStatus(holes), [holes])

  const teamA = (match.teamA || []).filter(Boolean)
  const teamB = (match.teamB || []).filter(Boolean)
  const teamALabel = teamA.map(toShort).join(' / ')
  const teamBLabel = teamB.map(toShort).join(' / ')

  const handleSelect = useCallback(async (hole, winner) => {
    const next = { ...holes }
    if (next[hole] === winner) {
      delete next[hole] // tapping same choice clears
    } else {
      next[hole] = winner
    }
    setHoles(next)
    // Persist on every tap for instant multi-device sync
    setSaving(true)
    try {
      const result = computeMatchStatus(next)
      await saveMatch({
        ...match,
        holes: next,
        status: result.status,
        thru: result.thru,
        leadingTeam: result.leadingTeam,
      })
    } finally {
      setSaving(false)
    }
  }, [holes, match, saveMatch])

  // leading color for header
  const leadColor =
    computed.leadingTeam === 'ca' ? '#C8102E' :
    computed.leadingTeam === 'pdx' ? '#003DA5' :
    '#6B7280'

  return (
    <div
      className="fixed inset-0 z-[130] flex flex-col"
      style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 70%)' }}
    >
      {/* Header */}
      <div
        className="w-full max-w-[430px] mx-auto flex items-center justify-between px-5 pb-2 shrink-0"
        style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top, 0px))' }}
      >
        <h2 className="text-[14px] font-bold tracking-[0.15em] uppercase text-accent-warm">
          Score Entry
        </h2>
        <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary">
          <X size={22} />
        </button>
      </div>

      {/* Match summary */}
      <div className="w-full max-w-[430px] mx-auto px-5 mb-3 shrink-0">
        <div
          className="rounded-xl px-4 py-3"
          style={{
            background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
            border: '1px solid #2A2A2E',
            borderLeftWidth: 3,
            borderLeftColor: leadColor,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-team-red mb-0.5">Drifters</p>
              <p className="text-[14px] font-semibold text-text-primary truncate">{teamALabel || '—'}</p>
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-team-blue mt-2 mb-0.5">Grifters</p>
              <p className="text-[14px] font-semibold text-text-primary truncate">{teamBLabel || '—'}</p>
            </div>
            <div className="text-right ml-4 shrink-0 flex items-center gap-2">
              {computed.isFinal && <Flag size={14} className="text-accent-warm" />}
              <div>
                <p className="text-[20px] font-bold leading-none" style={{ color: leadColor }}>
                  {computed.status}
                </p>
                <p className="text-[10px] text-text-muted mt-1 tracking-wide uppercase">
                  {computed.isFinal ? 'Final' : `thru ${computed.thru}`}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-surface-border flex items-center justify-around text-[11px]">
            <span className="text-team-red font-semibold">CA {computed.caWins}</span>
            <span className="text-text-muted">holes won</span>
            <span className="text-team-blue font-semibold">PDX {computed.pdxWins}</span>
          </div>
        </div>
      </div>

      {/* Hole-by-hole grid */}
      <div className="flex-1 overflow-y-auto w-full max-w-[430px] mx-auto px-5 pb-24">
        <p className="text-[11px] text-text-muted mb-2 text-center">
          Tap to set hole winner · tap again to clear
        </p>
        <div className="space-y-1.5">
          {Array.from({ length: TOTAL_HOLES }, (_, i) => i + 1).map((hole) => (
            <HoleRow
              key={hole}
              hole={hole}
              winner={holes[hole]}
              onSelect={(w) => handleSelect(hole, w)}
            />
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-bg-secondary/95 backdrop-blur-sm border-t border-surface-border"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="max-w-[430px] mx-auto px-5 py-3">
          <button
            onClick={onClose}
            className="w-full rounded-xl py-3 flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-wider bg-accent-warm text-bg-primary"
          >
            <Check size={16} />
            {saving ? 'Saving…' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  )
}

function HoleRow({ hole, winner, onSelect }) {
  const options = [
    { key: 'ca', label: 'DRIFT', color: '#C8102E' },
    { key: 'halved', label: '½', color: '#6B7280' },
    { key: 'pdx', label: 'GRIFT', color: '#003DA5' },
  ]

  return (
    <div
      className="flex items-center gap-2 rounded-xl px-3 py-2"
      style={{
        background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
        border: '1px solid #2A2A2E',
      }}
    >
      <span className="text-[12px] text-text-muted w-10 shrink-0 font-medium tabular-nums">
        Hole {hole}
      </span>
      <div className="flex-1 grid grid-cols-3 gap-1.5">
        {options.map((opt) => {
          const selected = winner === opt.key
          return (
            <button
              key={opt.key}
              onClick={() => onSelect(opt.key)}
              className="rounded-lg py-2 text-[12px] font-bold uppercase tracking-wider transition-all active:scale-[0.96]"
              style={{
                background: selected ? opt.color : 'transparent',
                color: selected ? '#fff' : opt.color,
                border: `1px solid ${selected ? opt.color : opt.color + '40'}`,
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
