import { useRef } from 'react'
import { Flag } from 'lucide-react'

const TAP_SLOP = 10 // px of movement allowed to still count as a tap
const TAP_MAX_MS = 500

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

  // Ref-based touch tracking: doesn't cause re-renders that could race with
  // PullToRefresh's touchmove handler and drop the click.
  const touchRef = useRef(null)
  const handledRef = useRef(false)

  const handleTouchStart = (e) => {
    if (!onClick) return
    const t = e.touches[0]
    touchRef.current = { x: t.clientX, y: t.clientY, t: Date.now() }
    handledRef.current = false
  }

  const handleTouchEnd = (e) => {
    if (!onClick || !touchRef.current) return
    const start = touchRef.current
    touchRef.current = null
    const t = e.changedTouches[0]
    const dx = Math.abs(t.clientX - start.x)
    const dy = Math.abs(t.clientY - start.y)
    const dt = Date.now() - start.t
    if (dx <= TAP_SLOP && dy <= TAP_SLOP && dt <= TAP_MAX_MS) {
      // Prevent the synthetic click that normally follows touchend so we
      // don't double-invoke onClick.
      e.preventDefault()
      handledRef.current = true
      onClick(e)
    }
  }

  const handleTouchCancel = () => {
    touchRef.current = null
  }

  const handleClick = (e) => {
    // If we already handled this as a touch tap, skip the follow-up click.
    if (handledRef.current) {
      handledRef.current = false
      return
    }
    if (onClick) onClick(e)
  }

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick ? handleClick : undefined}
      onTouchStart={onClick ? handleTouchStart : undefined}
      onTouchEnd={onClick ? handleTouchEnd : undefined}
      onTouchCancel={onClick ? handleTouchCancel : undefined}
      className={`mx-5 mb-2 rounded-xl overflow-hidden flex ${match.leadingTeam ? 'animate-flash' : ''} ${
        onClick ? 'active:scale-[0.99] transition-transform cursor-pointer' : ''
      }`}
      style={{
        background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.3)',
        border: '1px solid #2A2A2E',
        borderLeft: `3px solid ${borderColor}`,
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
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
