import { useState } from 'react'
import { players } from '../../data/mockData'
import { useDraft } from '../../hooks/useDraft'
import PowerRankings from '../PowerRankings'

// Look up full player object by name (so we have handicap, ghin, etc.)
function lookupPlayer(name) {
  return players.find((p) => p.name === name) || { name, handicap: null, wins: 0, losses: 0, draws: 0 }
}

export default function PlayersView() {
  const [tab, setTab] = useState('rankings')
  const { draft, ready } = useDraft()

  // Resolve rosters from live Firestore draft state
  const caRosterNames = draft?.caRoster || []
  const pdxRosterNames = draft?.pdxRoster || []
  const caPlayers = caRosterNames.map(lookupPlayer)
  const pdxPlayers = pdxRosterNames.map(lookupPlayer)

  // Draft pool: players not yet drafted, only show while draft is active/waiting
  const draftedSet = new Set([...caRosterNames, ...pdxRosterNames])
  const undrafted = ready
    ? players.filter((p) => !draftedSet.has(p.name))
    : []
  const showDraftPool = draft?.status !== 'complete' && undrafted.length > 0

  return (
    <div className="pt-6">
      {/* Toggle tabs */}
      <div className="flex mx-5 mb-4 rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2E' }}>
        <button
          onClick={() => setTab('rankings')}
          className={`flex-1 py-2.5 text-[12px] font-semibold uppercase tracking-wider transition-colors ${
            tab === 'rankings' ? 'bg-accent-warm/15 text-accent-warm' : 'text-text-muted'
          }`}
        >
          Power Rankings
        </button>
        <button
          onClick={() => setTab('roster')}
          className={`flex-1 py-2.5 text-[12px] font-semibold uppercase tracking-wider transition-colors ${
            tab === 'roster' ? 'bg-accent-warm/15 text-accent-warm' : 'text-text-muted'
          }`}
        >
          Roster
        </button>
      </div>

      {tab === 'rankings' && <PowerRankings />}

      {tab === 'roster' && (
        <>
          {caPlayers.length > 0 && (
            <TeamSection label="Drifters" color="#C8102E" players={caPlayers} />
          )}
          {pdxPlayers.length > 0 && (
            <TeamSection label="Grifters" color="#003DA5" players={pdxPlayers} />
          )}
          {showDraftPool && (
            <TeamSection label="Draft Pool" color="#6B7280" players={undrafted} />
          )}
          {caPlayers.length === 0 && pdxPlayers.length === 0 && !showDraftPool && (
            <p className="text-[13px] text-text-muted text-center py-6 mx-5">
              Rosters will appear once the draft starts
            </p>
          )}
        </>
      )}

      <div className="h-8" />
    </div>
  )
}

function TeamSection({ label, color, players }) {
  return (
    <div className="mb-5">
      <div className="mx-5 mb-2 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[14px] font-bold tracking-[0.12em] uppercase" style={{ color }}>{label}</span>
        <span className="text-[12px] text-text-muted ml-1">{players.length} players</span>
      </div>
      <div
        className="mx-5 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.3)',
          border: '1px solid #2A2A2E',
        }}
      >
        <div className="flex items-center px-4 py-2 border-b border-surface-border">
          <span className="flex-1 text-[11px] text-text-muted uppercase tracking-wider font-medium">Name</span>
          <span className="w-12 text-center text-[11px] text-text-muted uppercase tracking-wider font-medium">HCP</span>
          <span className="w-20 text-center text-[11px] text-text-muted uppercase tracking-wider font-medium">W-L-D</span>
        </div>
        {players.map((player, i) => (
          <div key={player.name} className={`flex items-center px-4 py-3 ${i !== players.length - 1 ? 'border-b border-surface-border' : ''}`}>
            <span className="flex-1 text-[14px] font-medium text-text-primary">{player.name}</span>
            <span className="w-12 text-center text-[13px] text-text-secondary tabular-nums">{player.handicap != null ? (player.handicap < 0 ? '+' + Math.abs(player.handicap) : player.handicap) : 'TBD'}</span>
            <span className="w-20 text-center text-[13px] font-medium tabular-nums text-text-secondary">{player.wins}-{player.losses}-{player.draws}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
