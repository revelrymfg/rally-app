import { useMatches } from '../hooks/useMatches'

export default function MomentumBar() {
  const { matches } = useMatches()

  // Consider all published, non-final matches as "live"
  const liveMatches = matches.filter(
    (m) => m.published && m.thru !== 'F' && m.thru !== 'FINAL',
  )

  if (liveMatches.length === 0) return null

  let caWins = 0
  let pdxWins = 0
  let ties = 0

  for (const m of liveMatches) {
    if (m.leadingTeam === 'ca') caWins++
    else if (m.leadingTeam === 'pdx') pdxWins++
    else ties++
  }

  const total = caWins + pdxWins + ties
  if (total === 0) return null

  const caPercent = (caWins / total) * 100
  const pdxPercent = (pdxWins / total) * 100
  const tiePercent = (ties / total) * 100

  return (
    <div className="mx-5 mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-team-red">
          CA {caWins}
        </span>
        <span className="text-[10px] text-text-muted uppercase tracking-wider font-medium">
          Match Leads
        </span>
        <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-team-blue">
          {pdxWins} PDX
        </span>
      </div>

      {/* Bar */}
      <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background: '#2A2A2E' }}>
        {caPercent > 0 && (
          <div
            className="h-full rounded-l-full animate-bar-fill"
            style={{
              width: `${caPercent}%`,
              background: 'linear-gradient(90deg, #C8102E, #e8304e)',
            }}
          />
        )}
        {ties > 0 && (
          <div
            className="h-full"
            style={{
              width: `${tiePercent}%`,
              background: '#555',
            }}
          />
        )}
        {pdxPercent > 0 && (
          <div
            className="h-full rounded-r-full animate-bar-fill"
            style={{
              width: `${pdxPercent}%`,
              background: 'linear-gradient(90deg, #1a5fd4, #003DA5)',
            }}
          />
        )}
      </div>

      {ties > 0 && (
        <p className="text-[10px] text-text-muted text-center mt-1">
          {ties} all square
        </p>
      )}
    </div>
  )
}
