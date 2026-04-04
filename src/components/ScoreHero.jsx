export default function ScoreHero({ scores, day, session }) {
  return (
    <section className="px-5 pb-6">
      <div className="flex items-center justify-center gap-4 px-2">
        {/* CA */}
        <div className="flex-1 text-right">
          <p className="text-[18px] font-bold tracking-[0.18em] uppercase text-team-red mb-1">
            CA
          </p>
          <p className="text-[42px] font-bold leading-none tracking-tight text-text-primary">
            {scores.ca}
            <span className="inline-block w-1 h-1 rounded-full bg-team-red ml-2 mb-2 align-middle" />
          </p>
        </div>

        {/* Divider */}
        <div className="flex flex-col items-center gap-1 pt-4">
          <div className="w-px h-10 bg-surface-border" />
          <span className="text-[10px] text-text-muted tracking-widest uppercase font-medium">VS</span>
          <div className="w-px h-10 bg-surface-border" />
        </div>

        {/* PDX */}
        <div className="flex-1 text-left">
          <p className="text-[18px] font-bold tracking-[0.18em] uppercase text-team-blue mb-1">
            PDX
          </p>
          <p className="text-[42px] font-bold leading-none tracking-tight text-text-primary">
            <span className="inline-block w-1 h-1 rounded-full bg-team-blue mr-2 mb-2 align-middle" />
            {scores.pdx}
          </p>
        </div>
      </div>

      {/* Session status */}
      <div className="flex items-center justify-center gap-2 mt-5">
        <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-accent-warm">
          Day {day}
        </span>
        <span className="w-1 h-1 rounded-full bg-accent-warm/40" />
        <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-accent-warm">
          {session}
        </span>
      </div>
    </section>
  )
}
