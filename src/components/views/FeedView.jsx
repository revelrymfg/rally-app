import { useState } from 'react'
import { Send } from 'lucide-react'
import FeedCard from '../FeedCard'
import { feed as initialFeed, playerShortNames } from '../../data/mockData'

export default function FeedView({ currentUser }) {
  const [posts, setPosts] = useState(initialFeed)
  const [message, setMessage] = useState('')

  const authorName = currentUser
    ? playerShortNames[currentUser.name] || currentUser.name.split(' ')[0]
    : 'You'

  function handleSubmit(e) {
    e.preventDefault()
    const text = message.trim()
    if (!text) return

    const newPost = {
      id: Date.now(),
      author: authorName,
      message: text,
      team: currentUser?.team || 'ca',
      time: 'just now',
    }
    setPosts([newPost, ...posts])
    setMessage('')
  }

  return (
    <div className="pt-6 flex flex-col min-h-[calc(100dvh-80px)]">
      <h2 className="text-[18px] font-bold tracking-[0.15em] uppercase text-accent-warm text-center mb-4">
        Trash Talk
      </h2>

      <div className="flex-1">
        {posts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
        <div className="h-4" />
      </div>

      {/* Input bar */}
      <div className="sticky bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] mx-5 mb-2">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Talk trash…"
            className="flex-1 bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted outline-none focus:border-accent-warm/50 transition-colors"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-xl bg-team-red flex items-center justify-center shrink-0 transition-opacity hover:opacity-80"
          >
            <Send size={16} className="text-white" />
          </button>
        </form>
      </div>
    </div>
  )
}
