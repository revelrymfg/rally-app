import { useRef } from 'react'
import { Flag } from 'lucide-react'

// Tap detection thresholds — anything beyond these is treated as a scroll/pull,
// not a tap. Keeps PullToRefresh from stealing taps.
const TAP_MAX_MOVE_PX = 10
const TAP_MAX_DURATION_MS = 500

export default function MatchCard({ match, onClick }) {
  const touchRef = useRef(null)

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

  const handleTouchStart = (e) => {
    if (!onClick) return
    const t = e.touches[0]
    touchRef.current = { x: t.clientX, y: t.clientY, t: Date.now() }
  }

  const handleTouchEnd = (e) => {
    if (!onClick || !touchRef.current) return
    const end = e.changedTouches[0]
    const start = touchRef.current
    const dx = Math.abs(end.clientX - start.x)
    const dy = Math.abs(end.clientY - start.y)
    const dt = Date.now() - start.t
    touchRef.current = null
    if (dx < TAP_MAX_MOVE_PX && dy < TAP_MAX_MOVE_PX && dt < TAP_MAX_DURATION_MS) {
      // Prevent the synthesized click that would fire ~300ms later (avoids
      // double-fire), and run our handler directly.
      e.preventDefault()
      onClick()
    }
  }

  const handleTouchCancel = () => {
    touchRef.current = null
  }

  // Desktop / non-touch fallback — only run if the previous touch handler
  // didn't already fire it. We use a ref flag to prevent double-fire on mobile.
  const synthClickGuard = useRef(false)
  const handleClick = (e) => {
    if (!onClick) return
    if (synthClickGuard.current) {
      synthClickGuard.current = false
      return
    }
    onClick(e)
  }

  const handleKeyDown = (e) => {
    if (!onClick) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(e)
    }
  }

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`mx-5 mb-2 rounded-xl overflow-hidden flex ${match.leadingTeam ? 'animate-flash' : ''} ${
        onClick ? 'active:scale-[0.99] transition-transform cursor-pointer' : ''
      }`}
      style={{
        background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.3)',
        border: '1px solid #2A2A2E',
        borderLeft: `3px solid ${borderColor}`,
        touchAction: 'manipulation',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div className="flex-1 flex items-center justify-between px-4 py-3.5 pointer-events-none">
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
