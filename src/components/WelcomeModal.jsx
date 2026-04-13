import { players } from '../data/mockData'

const caPlayers = players.filter((p) => p.team === 'ca')
const pdxPlayers = players.filter((p) => p.team === 'pdx')

export default function WelcomeModal({ onSelect }) {
  function handleSelect(player) {
    const user = { name: player.name, team: player.team }
    localStorage.setItem('rallyUser', JSON.stringify(user))
    onSelect(user)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 70%)' }}
    >
      <div className="w-full max-w-[430px] mx-auto h-dvh flex flex-col px-5 pt-6 pb-4">
        <div className="text-center mb-3">
          <p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-accent-warm/70 mb-1">
            Welcome to
          </p>
          <h1 className="text-[22px] font-[800] tracking-[0.12em] uppercase text-text-primary leading-tight">
            Rally in the Valley
          </h1>
          <p className="text-[11px] tracking-[0.15em] uppercase text-text-muted mt-0.5">
            2026
          </p>
        </div>

        <p className="text-[14px] font-semibold text-text-secondary text-center mb-3">
          Who are you?
        </p>

        <div className="flex-1 overflow-y-auto -mx-1 px-1 pb-4">
          <TeamGroup label="CA" color="#C8102E" players={caPlayers} onSelect={handleSelect} />
          <TeamGroup label="PDX" color="#003DA5" players={pdxPlayers} onSelect={handleSelect} />
        </div>
      </div>
    </div>
  )
}

function TeamGroup({ label, color, players, onSelect }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[13px] font-bold tracking-[0.12em] uppercase" style={{ color }}>
          {label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {players.map((player) => (
          <button
            key={player.name}
            onClick={() => onSelect(player)}
            className="rounded-xl px-3 py-3 text-left text-[14px] font-medium text-text-primary transition-all active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
              border: '1px solid #2A2A2E',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <span className="block truncate">{player.name}</span>
            <span className="text-[11px] text-text-muted">HCP {player.handicap}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
