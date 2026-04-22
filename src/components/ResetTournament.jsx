import { useState, useCallback } from 'react'
import { Trash2 } from 'lucide-react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

const ADMIN_PASSWORD = 'ojai2026'
const COLLECTIONS_TO_CLEAR = ['feed', 'votes', 'sideGames', 'awardsClosed', 'matches']

async function clearCollection(name) {
  const snap = await getDocs(collection(db, name))
  const deletes = snap.docs.map(d => deleteDoc(doc(db, name, d.id)))
  await Promise.all(deletes)
  return snap.size
}

export default function ResetTournament() {
  const [step, setStep] = useState('idle') // idle | password | confirm | resetting | done
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [pwError, setPwError] = useState(false)
  const [result, setResult] = useState(null)

  const isAdmin = localStorage.getItem('draftAdmin') === 'true'
  if (!isAdmin) return null

  function handlePasswordSubmit(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setStep('confirm')
      setPassword('')
      setPwError(false)
    } else {
      setPwError(true)
    }
  }

  const handleReset = useCallback(async () => {
    if (confirmText !== 'RESET') return
    setStep('resetting')

    let total = 0
    try {
      for (const name of COLLECTIONS_TO_CLEAR) {
        const count = await clearCollection(name)
        total += count
      }
      setResult({ success: true, count: total })
    } catch (err) {
      setResult({ success: false, error: err.message })
    }
    setStep('done')
  }, [confirmText])

  function handleClose() {
    setStep('idle')
    setConfirmText('')
    setResult(null)
  }

  return (
    <>
      <div className="mx-5 mt-4 mb-2">
        <button
          onClick={() => setStep('password')}
          className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2 text-[12px] font-medium uppercase tracking-wider text-team-red/60 border border-team-red/20 hover:border-team-red/40 hover:text-team-red transition-colors"
        >
          <Trash2 size={14} />
          Reset Tournament Data
        </button>
      </div>

      {/* Modal overlay */}
      {step !== 'idle' && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <div
            className="rounded-2xl px-6 py-6 w-full max-w-[340px]"
            style={{
              background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
              border: '1px solid #2A2A2E',
            }}
          >
            {/* Password step */}
            {step === 'password' && (
              <>
                <h3 className="text-[16px] font-bold text-text-primary text-center mb-1">
                  Admin Reset
                </h3>
                <p className="text-[12px] text-text-muted text-center mb-4">
                  Enter admin password to continue
                </p>
                <form onSubmit={handlePasswordSubmit}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPwError(false) }}
                    placeholder="Password"
                    autoFocus
                    style={{ fontSize: 16 }}
                    className={`w-full bg-bg-tertiary border rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-muted outline-none mb-3 ${
                      pwError ? 'border-team-red' : 'border-surface-border'
                    }`}
                  />
                  {pwError && <p className="text-[12px] text-team-red mb-3 text-center">Wrong password</p>}
                  <div className="flex gap-3">
                    <button type="button" onClick={handleClose} className="flex-1 rounded-xl py-2.5 text-[13px] font-semibold text-text-muted border border-surface-border">Cancel</button>
                    <button type="submit" className="flex-1 rounded-xl py-2.5 text-[13px] font-bold bg-team-red text-white">Continue</button>
                  </div>
                </form>
              </>
            )}

            {/* Confirm step */}
            {step === 'confirm' && (
              <>
                <h3 className="text-[16px] font-bold text-team-red text-center mb-2">
                  Danger Zone
                </h3>
                <p className="text-[13px] text-text-secondary text-center mb-4 leading-relaxed">
                  This will delete all feed posts, votes, side game results, and award data. This cannot be undone.
                </p>
                <p className="text-[12px] text-text-muted text-center mb-2">
                  Type <span className="font-bold text-text-primary">RESET</span> to confirm
                </p>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder="Type RESET"
                  autoFocus
                  style={{ fontSize: 16 }}
                  className="w-full bg-bg-tertiary border border-surface-border rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-muted outline-none mb-4 text-center tracking-widest font-bold"
                />
                <div className="flex gap-3">
                  <button onClick={handleClose} className="flex-1 rounded-xl py-2.5 text-[13px] font-semibold text-text-muted border border-surface-border">Cancel</button>
                  <button
                    onClick={handleReset}
                    disabled={confirmText !== 'RESET'}
                    className="flex-1 rounded-xl py-2.5 text-[13px] font-bold bg-team-red text-white disabled:opacity-30 transition-opacity"
                  >
                    Delete All
                  </button>
                </div>
              </>
            )}

            {/* Resetting step */}
            {step === 'resetting' && (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-team-red/30 border-t-team-red rounded-full animate-spin mx-auto mb-3" />
                <p className="text-[13px] text-text-muted">Deleting tournament data...</p>
              </div>
            )}

            {/* Done step */}
            {step === 'done' && (
              <div className="text-center">
                {result?.success ? (
                  <>
                    <p className="text-[16px] font-bold text-text-primary mb-2">Reset Complete</p>
                    <p className="text-[13px] text-text-muted mb-4">{result.count} documents deleted across {COLLECTIONS_TO_CLEAR.length} collections.</p>
                  </>
                ) : (
                  <>
                    <p className="text-[16px] font-bold text-team-red mb-2">Error</p>
                    <p className="text-[13px] text-text-muted mb-4">{result?.error || 'Unknown error'}</p>
                  </>
                )}
                <button onClick={handleClose} className="w-full rounded-xl py-2.5 text-[13px] font-bold bg-accent-warm text-bg-primary">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
