import { useState } from 'react'
import { Send } from 'lucide-react'
import FeedCard from '../FeedCard'
import { useFeed } from '../../hooks/useFirestore'
import { useUserTeam } from '../../hooks/useUserTeam'
import { playerShortNames } from '../../data/mockData'

// BottomNav is ~56px tall + safe area; input bar sits directly above it
const INPUT_BOTTOM_OFFSET = 'calc(56px + env(safe-area-inset-bottom, 0px))'
// Content needs room for the input bar (~52px) + bottom nav (~56px) + breathing room
const CONTENT_BOTTOM_PAD = 'calc(160px + env(safe-area-inset-bottom, 0px))'

export default function FeedView({ currentUser }) {
  const { posts, addPost } = useFeed()
  const [message, setMessage] = useState('')
  const userTeam = useUserTeam(currentUser)

  const authorName = currentUser
    ? playerShortNames[currentUser.name] || currentUser.name.split(' ')[0]
    : 'You'

  function handleSubmit(e) {
    e.preventDefault()
    const text = message.trim()
    if (!text) return
    addPost(authorName, text, userTeam || 'tbd')
    setMessage('')
  }

  return (
    <div className="pt-6" style={{ paddingBottom: CONTENT_BOTTOM_PAD }}>
      <h2 className="text-[18px] font-bold tracking-[0.15em] uppercase text-accent-warm text-center mb-4">
        Trash Talk
      </h2>

      {posts.length === 0 ? (
        <p className="text-[13px] text-text-muted text-center py-6">
          No posts yet — be the first to talk trash
        </p>
      ) : (
        posts.map((post) => <FeedCard key={post.id} post={post} />)
      )}

      {/* Input bar — fixed above bottom nav */}
      <div
        className="fixed left-0 right-0 z-40 bg-bg-secondary/95 backdrop-blur-sm border-t border-surface-border"
        style={{ bottom: INPUT_BOTTOM_OFFSET }}
      >
        <div className="max-w-[430px] mx-auto px-5 py-2.5">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Talk trash…"
              style={{ fontSize: 16 }}
              className="flex-1 bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-muted outline-none focus:border-accent-warm/50 transition-colors min-w-0"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-xl bg-team-red flex items-center justify-center shrink-0 transition-opacity hover:opacity-80"
              aria-label="Send"
            >
              <Send size={16} className="text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
