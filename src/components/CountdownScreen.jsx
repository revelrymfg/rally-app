import { useState, useEffect } from 'react'

// Tournament starts April 23, 2026 at 12:00pm Pacific (UTC-7)
const TOURNAMENT_START = new Date('2026-04-23T12:00:00-07:00').getTime()

const SCHEDULE = [
  { day: 'Thu Apr 23', round: 'Round 1', format: '2-Man Best Ball', time: '12:00pm' },
  { day: 'Fri Apr 24', round: 'Round 2', format: '2-Man Scramble', time: '8:00am' },
  { day: 'Fri Apr 24', round: 'Round 3', format: 'Singles Match Play', time: '1:00pm' },
]

function getTimeLeft() {
  const diff = TOURNAMENT_START - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

export function isTournamentStarted() {
  return Date.now() >= TOURNAMENT_START
}

export default function CountdownScreen({ onSkip }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      const t = getTimeLeft()
      if (!t) {
        clearInterval(timer)
        onSkip() // Tournament started — auto-skip
      }
      setTimeLeft(t)
    }, 1000)
    return () => clearInterval(timer)
  }, [onSkip])

  if (!timeLeft) return null

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto" style={{ background: '#0a0a0f' }}>
      {/* Animated background gradient */}
      <div
        className="fixed inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, #C8102E15 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #003DA515 0%, transparent 50%)',
          animation: 'bg-drift 8s ease-in-out infinite alternate',
        }}
      />

      <div className="relative w-full max-w-[430px] mx-auto px-5 pt-12 pb-8 min-h-dvh flex flex-col items-center">
        {/* SGC Logo */}
        <div className="relative mb-4">
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-15"
            style={{
              background: 'radial-gradient(circle, #1a2a4a 0%, transparent 70%)',
              transform: 'scale(2)',
            }}
          />
          <div
            className="relative rounded-full overflow-hidden"
            style={{
              width: 120,
              height: 120,
              filter: 'drop-shadow(0 4px 24px rgba(10,15,30,0.6))',
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}sgc-logo.png`}
              alt="Starch Golf Club"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.28)',
              }}
            />
          </div>
        </div>

        {/* Wordmark */}
        <h1 className="text-[20px] font-[800] tracking-[0.22em] uppercase text-accent-warm mb-1">
          Rally in the Valley
        </h1>
        <p className="text-[12px] font-medium tracking-[0.15em] uppercase text-text-muted mb-8" style={{ fontVariantCaps: 'all-small-caps', color: '#d4c9a8' }}>
          CUP · 2026
        </p>

        {/* Countdown */}
        <div className="flex gap-3 mb-2">
          <TimeUnit value={timeLeft.days} label="Days" color="#C8102E" />
          <Separator />
          <TimeUnit value={timeLeft.hours} label="Hours" color="#003DA5" />
          <Separator />
          <TimeUnit value={timeLeft.minutes} label="Min" color="#C8102E" />
          <Separator />
          <TimeUnit value={timeLeft.seconds} label="Sec" color="#003DA5" />
        </div>

        <p className="text-[11px] text-text-muted tracking-wider uppercase mb-8">
          Until first tee
        </p>

        {/* Checkerboard divider */}
        <div className="flex justify-center gap-0 mb-8 opacity-40">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5"
              style={{
                backgroundColor: (Math.floor(i / 8) + i) % 2 === 0 ? '#C2B8A3' : 'transparent',
              }}
            />
          ))}
        </div>

        {/* Schedule */}
        <div className="w-full space-y-3 mb-8">
          {SCHEDULE.map((s, i) => (
            <div
              key={i}
              className="rounded-xl px-4 py-3 flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
                border: '1px solid #2A2A2E',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-text-primary">
                  {s.round}: {s.format}
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {s.day} · {s.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Location */}
        <p className="text-[12px] text-text-muted tracking-wider text-center mb-8">
          Soule Park Golf Course · Ojai, CA
        </p>

        {/* Checkerboard divider */}
        <div className="flex justify-center gap-0 mb-8 opacity-40">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5"
              style={{
                backgroundColor: (Math.floor(i / 8) + i) % 2 === 0 ? '#C2B8A3' : 'transparent',
              }}
            />
          ))}
        </div>

        {/* Skip link */}
        <button
          onClick={onSkip}
          className="text-[12px] text-text-muted underline underline-offset-2 hover:text-text-secondary transition-colors"
        >
          View App
        </button>
      </div>

      <style>{`
        @keyframes bg-drift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-20px, 10px) scale(1.05); }
        }
      `}</style>
    </div>
  )
}

function TimeUnit({ value, label, color }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center mb-1"
        style={{
          background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
          border: `1px solid ${color}33`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 0 20px ${color}10`,
        }}
      >
        <span className="text-[28px] font-[800] tabular-nums text-text-primary">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] text-text-muted uppercase tracking-wider">{label}</span>
    </div>
  )
}

function Separator() {
  return (
    <div className="flex flex-col items-center justify-center pt-1">
      <span className="text-[20px] font-bold text-text-muted leading-none">:</span>
    </div>
  )
}
