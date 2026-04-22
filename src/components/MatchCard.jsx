import { Flag } from 'lucide-react'

export default function MatchCard({ match, onClick }) {
  const borderColor =
    match.leadingTeam === 'ca'
      ? '#C8102E'
      : match.leadingTeam === 'pdx'
        ? '#003DA5'
        : '#555555'

  const statusColor =
    match.leadingTeam === 'ca'
      ? 'text-team-red'
      : match.leadingTeam === 'pdx'
        ? 'text-team-blue'
        : 'text-text-muted'

  const isComplete = match.thru === 'F' || match.thru === 'FINAL'
  const is1v1 = (match.teamA || []).length === 1 && (match.teamB || []).length === 1

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={`mx-5 mb-2 rounded-xl overflow-hidden flex ${match.leadingTeam ? 'animate-flash' : ''} ${
        onClick ? 'active:scale-[0.99] transition-transform cursor-pointer' : ''
      }`}
      style={{
        background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.3)',
        border: '1px solid #2A2A2E',
        borderLeft: `3px solid ${borderColor}`,
      }}
    >
      <div className="flex-1 flex items-center justify-between px-4 py-3.5">
        {/* Player names */}
        <div className="flex-1 min-w-0">
          {is1v1 ? (
            <p className="text-[14px] font-medium text-text-primary truncate">
              <span className="text-team-red">{match.teamA[0]}</span>
              <span className="text-text-muted mx-1.5 text-[12px] tracking-wider">vs</span>
              <span className="text-team-blue">{match.teamB[0]}</span>
            </p>
          ) : (
            <>
              <p className="text-[14px] font-medium text-text-primary truncate">
                {(match.teamA || []).join(' / ')}
              </p>
              <p className="text-[13px] text-text-secondary truncate mt-0.5">
                {(match.teamB || []).join(' / ')}
              </p>
            </>
          )}
        </div>

        {/* Status */}
        <div className="text-right ml-4 shrink-0 flex items-center gap-2">
          {isComplete && (
            <Flag size={14} className="text-accent-warm animate-flag" />
          )}
          <div>
            <p className={`text-[18px] font-semibold leading-none ${statusColor}`}>
              {match.status}
            </p>
            <p className="text-[11px] text-text-muted mt-1 tracking-wide uppercase">
              {isComplete ? 'Final' : `thru ${match.thru}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
