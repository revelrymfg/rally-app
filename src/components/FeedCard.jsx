export default function FeedCard({ post }) {
  const isSystem = post.team === 'system'
  const ringColor = isSystem ? '#C2B8A3' : post.team === 'ca' ? '#C8102E' : '#003DA5'
  const initial = isSystem ? '!' : post.author[0]

  return (
    <div
      className="mx-5 mb-2 rounded-xl px-4 py-3.5 flex gap-3"
      style={{
        background: isSystem
          ? 'linear-gradient(135deg, #2a2520 0%, #1f1b17 100%)'
          : 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.3)',
        border: isSystem ? '1px solid #C2B8A333' : '1px solid #2A2A2E',
      }}
    >
      {/* Avatar with 2px team color ring */}
      <div
        className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center shrink-0"
        style={{ border: `2px solid ${ringColor}` }}
      >
        <span className={`text-[12px] font-semibold ${isSystem ? 'text-accent-warm' : 'text-text-secondary'}`}>
          {initial}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={`text-[14px] font-medium ${isSystem ? 'text-accent-warm' : 'text-text-primary'}`}>
            {post.author}
          </span>
          <span className="text-[11px] text-text-muted">{post.time}</span>
        </div>
        <p className={`text-[14px] mt-0.5 leading-relaxed ${isSystem ? 'text-accent-warm/80' : 'text-text-secondary'}`}>
          {post.message}
        </p>
      </div>
    </div>
  )
}
