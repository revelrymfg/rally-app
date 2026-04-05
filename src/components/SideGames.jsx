import { useState, useCallback } from 'react'
import { Target, Ruler, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { players, rounds } from '../data/mockData'
import { useSideGames } from '../hooks/useFirestore'

const categories = [
  { id: 'longest-drive', label: 'Longest Drive', icon: Ruler },
  { id: 'closest-pin', label: 'Closest to the Pin', icon: Target },
]

export default function SideGames() {
  const { games, saveGame } = useSideGames()
  const [adminOpen, setAdminOpen] = useState(false)

  // Flatten all entries for display
  const entries = []
  for (const cat of categories) {
    for (const round of rounds) {
      const key = `${cat.id}_${round.id}`
      if (games[key]) {
        entries.push({
          ...games[key],
          category: cat.label,
          categoryId: cat.id,
          roundId: round.id,
          Icon: cat.icon,
        })
      }
    }
  }

  // Tally wins per player
  const winCounts = {}
  for (const e of entries) {
    winCounts[e.winner] = (winCounts[e.winner] || 0) + 1
  }

  return (
    <div className="mx-5 mb-4">
      {entries.length > 0 ? (
        <div className="space-y-1.5 mb-3">
          {entries.map((entry) => {
            const player = players.find(p => p.name === entry.winner)
            const teamColor = player?.team === 'ca' ? '#C8102E' : '#003DA5'
            return (
              <div
                key={`${entry.categoryId}-${entry.roundId}`}
                className="rounded-xl px-3.5 py-2.5 flex items-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.3)',
                  border: '1px solid #2A2A2E',
                  borderLeftWidth: 3,
                  borderLeftColor: teamColor,
                }}
              >
                <entry.Icon size={14} className="text-accent-warm shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-text-primary truncate">
                    {entry.winner.split(' ')[0]}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {entry.category} — Rd {entry.roundId}, Hole {entry.hole}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-[13px] text-text-muted text-center py-3">No side game results yet</p>
      )}

      {Object.keys(winCounts).length > 1 && (
        <div
          className="rounded-xl px-3.5 py-2.5 mb-3"
          style={{ background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)', border: '1px solid #2A2A2E' }}
        >
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-muted mb-1.5">
            Side Game Leaders
          </p>
          {Object.entries(winCounts).sort((a, b) => b[1] - a[1]).map(([name, count]) => {
            const player = players.find(p => p.name === name)
            const teamColor = player?.team === 'ca' ? '#C8102E' : '#003DA5'
            return (
              <div key={name} className="flex items-center gap-2 py-1">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: teamColor }} />
                <span className="flex-1 text-[13px] text-text-primary">{name.split(' ')[0]}</span>
                <span className="text-[12px] font-semibold tabular-nums text-accent-warm">{count}</span>
              </div>
            )
          })}
        </div>
      )}

      <button
        onClick={() => setAdminOpen(!adminOpen)}
        className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2 text-[12px] font-medium uppercase tracking-wider text-text-muted border border-surface-border hover:border-accent-warm/30 hover:text-text-secondary transition-colors"
      >
        {adminOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {adminOpen ? 'Close Admin' : 'Enter Results'}
      </button>

      {adminOpen && <AdminPanel games={games} saveGame={saveGame} />}
    </div>
  )
}

function AdminPanel({ games, saveGame }) {
  return (
    <div className="mt-3 space-y-3">
      {categories.map((cat) => (
        <div key={cat.id}>
          <p className="text-[12px] font-bold tracking-[0.1em] uppercase text-text-secondary mb-2 flex items-center gap-1.5">
            <cat.icon size={13} />
            {cat.label}
          </p>
          {rounds.map((round) => {
            const key = `${cat.id}_${round.id}`
            return (
              <AdminRow
                key={key}
                roundId={round.id}
                existing={games[key]}
                onSave={(entry) => saveGame(key, entry)}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

function AdminRow({ roundId, existing, onSave }) {
  const [editing, setEditing] = useState(!existing)
  const [winner, setWinner] = useState(existing?.winner || '')
  const [hole, setHole] = useState(existing?.hole || '')

  const handleSave = useCallback(() => {
    if (!winner || !hole) return
    onSave({ winner, hole })
    setEditing(false)
  }, [winner, hole, onSave])

  if (!editing && existing) {
    return (
      <div className="flex items-center gap-2 mb-2 px-2">
        <span className="text-[12px] text-text-muted w-14">Round {roundId}</span>
        <span className="flex-1 text-[13px] text-text-primary">{existing.winner.split(' ')[0]}</span>
        <span className="text-[12px] text-text-muted">Hole {existing.hole}</span>
        <button onClick={() => setEditing(true)} className="text-[11px] text-text-muted underline underline-offset-2">Edit</button>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl px-3 py-2.5 mb-2 flex items-center gap-2"
      style={{ background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)', border: '1px solid #2A2A2E' }}
    >
      <span className="text-[12px] text-text-muted w-10 shrink-0">Rd {roundId}</span>
      <select
        value={winner}
        onChange={(e) => setWinner(e.target.value)}
        className="flex-1 bg-bg-tertiary border border-surface-border rounded-lg px-2 py-1.5 text-[12px] text-text-primary outline-none min-w-0"
      >
        <option value="">Player</option>
        {players.map((p) => (
          <option key={p.name} value={p.name}>{p.name}</option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        max="18"
        value={hole}
        onChange={(e) => setHole(e.target.value)}
        placeholder="#"
        className="w-12 bg-bg-tertiary border border-surface-border rounded-lg px-2 py-1.5 text-[12px] text-text-primary text-center outline-none"
      />
      <button
        onClick={handleSave}
        disabled={!winner || !hole}
        className="w-8 h-8 rounded-lg bg-accent-warm/20 flex items-center justify-center shrink-0 disabled:opacity-30 transition-opacity"
      >
        <Check size={14} className="text-accent-warm" />
      </button>
    </div>
  )
}
