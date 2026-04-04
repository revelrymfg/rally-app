export default function SectionHeader({ title, live = false }) {
  return (
    <div className="flex items-center gap-2 px-5 pt-6 pb-3">
      {live && (
        <span className="w-1.5 h-1.5 rounded-full bg-team-red animate-pulse-live" />
      )}
      <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-text-secondary">
        {title}
      </h2>
      <div className="flex-1 h-px bg-surface-border ml-2" />
    </div>
  )
}
