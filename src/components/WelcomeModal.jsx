import { players } from '../data/mockData'

function formatHcp(val) {
  if (val < 0) return `+${Math.abs(val)}`
  return String(val)
}

// Show all players sorted alphabetically for identity selection
const allPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name))

export default function WelcomeModal({ onSelect }) {
  function handleSelect(player) {
    const user = { name: player.name, team: player.team || 'tbd' }
    localStorage.setItem('rallyUser', JSON.stringify(user))
    onSelect(user)
  }

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto"
      style={{
        background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 70%)',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div className="w-full max-w-[430px] mx-auto px-5 pb-8" style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top, 0px))' }}>
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

        <div className="grid grid-cols-2 gap-2">
          {allPlayers.map((player) => {
            const badgeColor = player.captain
              ? (player.team === 'ca' ? '#C8102E' : '#003DA5')
              : null
            return (
              <button
                key={player.name}
                onClick={() => handleSelect(player)}
                className="rounded-xl px-3 py-3 text-left text-[14px] font-medium text-text-primary transition-all active:scale-[0.97]"
                style={{
                  background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
                  border: badgeColor ? `1.5px solid ${badgeColor}` : '1px solid #2A2A2E',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                <span className="block truncate">
                  {player.captain ? '👑 ' : ''}{player.name}
                </span>
                <span className="text-[11px] text-text-muted">
                  {player.handicap != null ? `HCP ${formatHcp(player.handicap)}` : 'HCP TBD'}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
