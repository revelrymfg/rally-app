export default function LeaderboardList({ players }) {
  return (
    <div
      className="mx-5 rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.3)',
        border: '1px solid #2A2A2E',
      }}
    >
      {players.map((player, i) => (
        <div
          key={player.rank}
          className={`flex items-center px-4 py-3 ${
            i !== players.length - 1 ? 'border-b border-surface-border' : ''
          }`}
        >
          <span className="text-[13px] text-text-muted w-6 tabular-nums font-medium">
            {player.rank}
          </span>
          {/* Team color dot */}
          <span
            className="w-2 h-2 rounded-full mr-2.5 shrink-0"
            style={{ backgroundColor: player.team === 'ca' ? '#C8102E' : '#003DA5' }}
          />
          <span className="flex-1 text-[15px] font-medium text-text-primary">
            {player.name}
          </span>
          <span
            className={`text-[15px] font-semibold tabular-nums ${
              player.team === 'ca' ? 'text-team-red' : 'text-team-blue'
            }`}
          >
            {player.points}
          </span>
        </div>
      ))}
    </div>
  )
}
