import { players } from '../../data/mockData'

export default function PlayersView() {
  const caPlayers = players.filter((p) => p.team === 'ca')
  const pdxPlayers = players.filter((p) => p.team === 'pdx')

  return (
    <div className="pt-6">
      <h2 className="text-[18px] font-bold tracking-[0.15em] uppercase text-accent-warm text-center mb-4">
        Players
      </h2>

      <TeamSection label="CA" color="#C8102E" players={caPlayers} />
      <TeamSection label="PDX" color="#003DA5" players={pdxPlayers} />

      <div className="h-8" />
    </div>
  )
}

function TeamSection({ label, color, players }) {
  return (
    <div className="mb-5">
      <div className="mx-5 mb-2 flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span
          className="text-[14px] font-bold tracking-[0.12em] uppercase"
          style={{ color }}
        >
          {label}
        </span>
        <span className="text-[12px] text-text-muted ml-1">
          {players.length} players
        </span>
      </div>

      <div
        className="mx-5 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.3)',
          border: '1px solid #2A2A2E',
        }}
      >
        {/* Header */}
        <div className="flex items-center px-4 py-2 border-b border-surface-border">
          <span className="flex-1 text-[11px] text-text-muted uppercase tracking-wider font-medium">
            Name
          </span>
          <span className="w-12 text-center text-[11px] text-text-muted uppercase tracking-wider font-medium">
            HCP
          </span>
          <span className="w-20 text-center text-[11px] text-text-muted uppercase tracking-wider font-medium">
            W-L-D
          </span>
        </div>

        {players.map((player, i) => (
          <div
            key={player.name}
            className={`flex items-center px-4 py-3 ${
              i !== players.length - 1 ? 'border-b border-surface-border' : ''
            }`}
          >
            <span className="flex-1 text-[14px] font-medium text-text-primary">
              {player.name}
            </span>
            <span className="w-12 text-center text-[13px] text-text-secondary tabular-nums">
              {player.handicap}
            </span>
            <span className="w-20 text-center text-[13px] font-medium tabular-nums text-text-secondary">
              {player.wins}-{player.losses}-{player.draws}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
