import { useState } from 'react'
import { Users } from 'lucide-react'
import { useDraft } from '../hooks/useDraft'
import DraftRoom from './DraftRoom'

const DRAFT_PASSWORD = 'ojai2026'

export default function DraftButton() {
  const { draft, ready } = useDraft()
  const [showRoom, setShowRoom] = useState(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const isAdmin = localStorage.getItem('draftAdmin') === 'true'

  if (!ready) return null
  if (draft.status === 'complete') return null

  function handleAdminEntry() {
    if (isAdmin) {
      setShowRoom(true)
    } else {
      setShowPasswordPrompt(true)
    }
  }

  function handlePasswordSubmit(e) {
    e.preventDefault()
    if (password === DRAFT_PASSWORD) {
      localStorage.setItem('draftAdmin', 'true')
      setShowPasswordPrompt(false)
      setPassword('')
      setError(false)
      setShowRoom(true)
    } else {
      setError(true)
    }
  }

  return (
    <>
      <div className="mx-5 mb-4 flex gap-2">
        <button
          onClick={handleAdminEntry}
          className="flex-1 rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #2a2520 0%, #1f1b17 100%)',
            border: '1px solid #C2B8A344',
            boxShadow: 'inset 0 1px 0 rgba(194,184,163,0.08)',
          }}
        >
          <Users size={16} className="text-accent-warm" />
          <span className="text-[13px] font-semibold tracking-wider uppercase text-accent-warm">
            {isAdmin ? 'Enter Draft Room' : 'Draft Room'}
          </span>
        </button>

        {draft.status === 'active' && !isAdmin && (
          <button
            onClick={() => setShowRoom(true)}
            className="rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
              border: '1px solid #2A2A2E',
            }}
          >
            <span className="text-[12px] font-semibold tracking-wider uppercase text-text-secondary">
              Watch Live
            </span>
          </button>
        )}
      </div>

      {/* Password prompt */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="mx-8 rounded-2xl px-6 py-6 w-full max-w-[340px]"
            style={{
              background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
              border: '1px solid #2A2A2E',
            }}
          >
            <h3 className="text-[16px] font-bold text-text-primary text-center mb-4">
              Admin Access
            </h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false) }}
                placeholder="Enter password"
                autoFocus
                className={`w-full bg-bg-tertiary border rounded-xl px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted outline-none mb-3 ${
                  error ? 'border-team-red' : 'border-surface-border focus:border-accent-warm/50'
                }`}
              />
              {error && (
                <p className="text-[12px] text-team-red mb-3 text-center">Wrong password</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowPasswordPrompt(false); setPassword(''); setError(false) }}
                  className="flex-1 rounded-xl py-2.5 text-[13px] font-semibold text-text-muted border border-surface-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl py-2.5 text-[13px] font-bold bg-accent-warm text-bg-primary"
                >
                  Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Draft Room */}
      {showRoom && (
        <DraftRoom
          isAdmin={isAdmin}
          onClose={() => setShowRoom(false)}
        />
      )}
    </>
  )
}
