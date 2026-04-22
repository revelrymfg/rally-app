import { useEffect, useState } from 'react'
import { MessageCircle, Zap, Users, Flag } from 'lucide-react'

const ICONS = {
  feed: MessageCircle,
  draft: Users,
  score: Zap,
  match: Flag,
  system: Zap,
}

export default function Toast({ id, type, title, message, team, onDismiss }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    // Slide in on mount
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeaving(true)
      setTimeout(onDismiss, 250)
    }, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  function handleTap() {
    setLeaving(true)
    setTimeout(onDismiss, 200)
  }

  const accentColor =
    team === 'ca' ? '#C8102E' :
    team === 'pdx' ? '#003DA5' :
    '#C2B8A3'

  const Icon = ICONS[type] || MessageCircle

  return (
    <div
      onClick={handleTap}
      className="pointer-events-auto mx-3 mb-2 rounded-xl px-3.5 py-2.5 flex items-center gap-3 cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
        border: '1px solid #2A2A2E',
        borderLeftWidth: 3,
        borderLeftColor: accentColor,
        boxShadow: '0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        transform: leaving
          ? 'translateY(-20px)'
          : visible
            ? 'translateY(0)'
            : 'translateY(-100%)',
        opacity: leaving ? 0 : visible ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out',
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accentColor}22` }}
      >
        <Icon size={14} style={{ color: accentColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-text-primary truncate">
          {title}
        </p>
        <p className="text-[12px] text-text-secondary truncate mt-0.5">
          {message}
        </p>
      </div>
    </div>
  )
}
