import { useState, useCallback, useMemo, useEffect } from 'react'
import { X, Check, Flag } from 'lucide-react'
import { useMatches } from '../hooks/useMatches'
import { playerShortNames } from '../data/mockData'

const TOTAL_HOLES = 18

// Match-play result options for Quick Result entry
const RESULT_OPTIONS = ['1UP', '2&1', '3&2', '4&3', '5&4', '6&5', '7&6', '8&7']

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
  const [tab, setTab] = useState('quick')

  // Quick result UI state
  const initialWinner = match.thru === 'F' ? match.leadingTeam || (match.status === 'HALVED' ? 'halved' : null) : null
  const initialResult = match.thru === 'F' && match.status !== 'HALVED' ? match.status : null
  const [quickWinner, setQuickWinner] = useState(initialWinner) // 'ca' | 'pdx' | 'halved'
  const [quickResult, setQuickResult] = useState(initialResult) // '1UP' | '2&1' | ...

  // Lock background scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Keep local hole state in sync if Firestore pushes external updates
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
      delete next[hole]
    } else {
      next[hole] = winner
    }
    setHoles(next)
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

  // Submit quick result — saves final match result to Firestore
  const handleQuickSubmit = useCallback(async () => {
    if (!quickWinner) return
    if (quickWinner !== 'halved' && !quickResult) return
    setSaving(true)
    try {
      const leadingTeam = quickWinner === 'halved' ? null : quickWinner
      const status = quickWinner === 'halved' ? 'HALVED' : quickResult
      await saveMatch({
        ...match,
        status,
        thru: 'F',
        leadingTeam,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }, [quickWinner, quickResult, match, saveMatch, onClose])

  // Live header color based on current state (quick or hole-by-hole)
  const liveLeading = tab === 'quick'
    ? (quickWinner === 'halved' ? null : quickWinner)
    : computed.leadingTeam
  const leadColor =
    liveLeading === 'ca' ? '#C8102E' :
    liveLeading === 'pdx' ? '#003DA5' :
    '#6B7280'

  const displayStatus = tab === 'quick'
    ? (quickWinner === 'halved' ? 'HALVED' : quickResult || (match.thru === 'F' ? match.status : '-'))
    : computed.status
  const displayThru = tab === 'quick'
    ? (quickWinner ? 'F' : (match.thru || '-'))
    : computed.thru
  const displayFinal = tab === 'quick' ? !!quickWinner : computed.isFinal

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
              {displayFinal && <Flag size={14} className="text-accent-warm" />}
              <div>
                <p className="text-[20px] font-bold leading-none" style={{ color: leadColor }}>
                  {displayStatus}
                </p>
                <p className="text-[10px] text-text-muted mt-1 tracking-wide uppercase">
                  {displayFinal ? 'Final' : `thru ${displayThru}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="w-full max-w-[430px] mx-auto px-5 mb-3 shrink-0">
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2E' }}>
          <button
            onClick={() => setTab('quick')}
            className={`flex-1 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
              tab === 'quick' ? 'bg-accent-warm/15 text-accent-warm' : 'text-text-muted'
            }`}
          >
            Quick Result
          </button>
          <button
            onClick={() => setTab('holes')}
            className={`flex-1 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
              tab === 'holes' ? 'bg-accent-warm/15 text-accent-warm' : 'text-text-muted'
            }`}
          >
            Hole by Hole
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto w-full max-w-[430px] mx-auto px-5 pb-32">
        {tab === 'quick' ? (
          <QuickResult
            quickWinner={quickWinner}
            quickResult={quickResult}
            onWinnerChange={setQuickWinner}
            onResultChange={setQuickResult}
          />
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-bg-secondary/95 backdrop-blur-sm border-t border-surface-border"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="max-w-[430px] mx-auto px-5 py-3">
          {tab === 'quick' ? (
            <button
              onClick={handleQuickSubmit}
              disabled={!quickWinner || (quickWinner !== 'halved' && !quickResult) || saving}
              className="w-full rounded-xl py-3 flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-wider bg-accent-warm text-bg-primary disabled:opacity-40 transition-opacity"
            >
              <Check size={16} />
              {saving ? 'Submitting…' : 'Submit Result'}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full rounded-xl py-3 flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-wider bg-accent-warm text-bg-primary"
            >
              <Check size={16} />
              {saving ? 'Saving…' : 'Done'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function QuickResult({ quickWinner, quickResult, onWinnerChange, onResultChange }) {
  const halvedSelected = quickWinner === 'halved'

  return (
    <div className="space-y-5">
      {/* Winner */}
      <div>
        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-text-muted mb-2">
          Who won?
        </p>
        <div className="grid grid-cols-3 gap-2">
          <WinnerButton
            active={quickWinner === 'ca'}
            color="#C8102E"
            label="Drifters"
            onClick={() => onWinnerChange('ca')}
          />
          <WinnerButton
            active={quickWinner === 'halved'}
            color="#C2B8A3"
            label="Halved"
            onClick={() => {
              onWinnerChange('halved')
              onResultChange(null)
            }}
          />
          <WinnerButton
            active={quickWinner === 'pdx'}
            color="#003DA5"
            label="Grifters"
            onClick={() => onWinnerChange('pdx')}
          />
        </div>
      </div>

      {/* Result */}
      {!halvedSelected && (
        <div>
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-text-muted mb-2">
            Result
          </p>
          <div className="grid grid-cols-4 gap-2">
            {RESULT_OPTIONS.map((r) => {
              const selected = quickResult === r
              return (
                <button
                  key={r}
                  onClick={() => onResultChange(r)}
                  disabled={!quickWinner}
                  className="rounded-xl py-3 text-[14px] font-bold tabular-nums transition-all active:scale-[0.96] disabled:opacity-30"
                  style={{
                    background: selected ? 'rgba(194,184,163,0.15)' : 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
                    color: selected ? '#C2B8A3' : '#A1A1AA',
                    border: `1px solid ${selected ? '#C2B8A3' : '#2A2A2E'}`,
                  }}
                >
                  {r}
                </button>
              )
            })}
          </div>
          <p className="text-[10px] text-text-muted mt-2 text-center">
            1UP = won on 18 · 2&1 = closed out with 1 to play · etc.
          </p>
        </div>
      )}

      {halvedSelected && (
        <p className="text-[12px] text-text-muted text-center py-2">
          Match will be saved as Halved (tie)
        </p>
      )}
    </div>
  )
}

function WinnerButton({ active, color, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl py-3.5 text-[12px] font-bold uppercase tracking-wider transition-all active:scale-[0.96]"
      style={{
        background: active ? color : 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
        color: active ? '#fff' : color,
        border: `1.5px solid ${active ? color : color + '55'}`,
        boxShadow: active ? `0 0 20px ${color}40` : 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {label}
    </button>
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
