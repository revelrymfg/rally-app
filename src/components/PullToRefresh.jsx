import { useState, useRef, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'

const THRESHOLD = 60

export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const isDragging = useRef(false)

  const handleTouchStart = useCallback((e) => {
    // Only activate when scrolled to top
    if (window.scrollY > 5) return
    startY.current = e.touches[0].clientY
    isDragging.current = true
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging.current || refreshing) return
    const diff = e.touches[0].clientY - startY.current
    if (diff < 0) {
      isDragging.current = false
      setPulling(false)
      setPullDistance(0)
      return
    }
    // Dampen the pull — feels more natural
    const dampened = Math.min(diff * 0.45, 100)
    setPullDistance(dampened)
    setPulling(dampened > 0)
  }, [refreshing])

  const handleTouchEnd = useCallback(async () => {
    if (!isDragging.current && !pulling) return
    isDragging.current = false

    if (pullDistance >= THRESHOLD && !refreshing) {
      setRefreshing(true)
      setPullDistance(THRESHOLD * 0.7)

      if (onRefresh) {
        await onRefresh()
      } else {
        // Default: brief pause to simulate refresh since Firestore is real-time
        await new Promise(r => setTimeout(r, 600))
      }

      setRefreshing(false)
    }

    setPulling(false)
    setPullDistance(0)
  }, [pullDistance, refreshing, onRefresh])

  const progress = Math.min(pullDistance / THRESHOLD, 1)
  const showIndicator = pulling || refreshing

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Refresh indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200"
        style={{
          height: showIndicator ? Math.max(pullDistance, refreshing ? 40 : 0) : 0,
          opacity: showIndicator ? Math.min(progress * 1.5, 1) : 0,
        }}
      >
        <div
          className={`flex items-center gap-2 ${refreshing ? 'animate-spin' : ''}`}
          style={{
            transform: refreshing ? undefined : `rotate(${progress * 360}deg)`,
            transition: refreshing ? undefined : 'transform 0.1s',
          }}
        >
          <RefreshCw size={18} className="text-accent-warm" />
        </div>
        {refreshing && (
          <span className="text-[11px] text-text-muted ml-2 tracking-wider uppercase">
            Refreshing
          </span>
        )}
      </div>

      {/* Content with pull transform */}
      <div
        style={{
          transform: pulling && !refreshing ? `translateY(${pullDistance * 0.15}px)` : 'none',
          transition: pulling ? 'none' : 'transform 0.25s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}
