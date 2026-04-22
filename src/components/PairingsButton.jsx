import { useState } from 'react'
import { ListOrdered } from 'lucide-react'
import PairingsManager from './PairingsManager'

export default function PairingsButton() {
  const [open, setOpen] = useState(false)
  const isAdmin = localStorage.getItem('draftAdmin') === 'true'
  if (!isAdmin) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mx-5 mb-4 w-[calc(100%-2.5rem)] rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, #2a2520 0%, #1f1b17 100%)',
          border: '1px solid #C2B8A344',
          boxShadow: 'inset 0 1px 0 rgba(194,184,163,0.08)',
        }}
      >
        <ListOrdered size={16} className="text-accent-warm" />
        <span className="text-[13px] font-semibold tracking-wider uppercase text-accent-warm">
          Manage Pairings
        </span>
      </button>

      {open && <PairingsManager onClose={() => setOpen(false)} />}
    </>
  )
}
