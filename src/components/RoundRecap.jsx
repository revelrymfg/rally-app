import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'

function generateRecap(round) {
  const caWins = round.matches.filter(m => m.leadingTeam === 'ca').length
  const pdxWins = round.matches.filter(m => m.leadingTeam === 'pdx').length
  const ties = round.matches.filter(m => !m.leadingTeam).length
  const total = round.matches.length

  const bigWins = round.matches.filter(m => {
    const s = m.status
    return s.includes('3') || s.includes('4') || s.includes('5')
  })

  const leader = caWins > pdxWins ? 'Drifters' : pdxWins > caWins ? 'Grifters' : null

  let recap = `${round.name.toUpperCase()} — THE RECAP\n\n`

  if (leader) {
    recap += `${leader} dominated ${round.name.split(' — ')[1]} play, taking ${leader === 'Drifters' ? caWins : pdxWins} of ${total} matches`
    if (ties > 0) recap += ` with ${ties} going all square`
    recap += '.\n\n'
  } else {
    recap += `An absolute war. ${round.name.split(' — ')[1]} ended dead even at ${caWins}-${pdxWins} with ${ties} ties. Neither side blinked.\n\n`
  }

  // Highlight big wins
  for (const m of bigWins) {
    const winners = m.leadingTeam === 'ca' ? m.teamA : m.teamB
    const losers = m.leadingTeam === 'ca' ? m.teamB : m.teamA
    recap += `${winners.join(' & ')} crushed ${losers.join(' & ')} ${m.status} — a statement win that echoed across the valley.\n\n`
  }

  // Close matches
  const closeOnes = round.matches.filter(m => m.status === '1UP' || m.status === 'AS')
  if (closeOnes.length > 0) {
    recap += `${closeOnes.length} match${closeOnes.length > 1 ? 'es' : ''} went down to the wire. `
    const oneUp = closeOnes.find(m => m.status === '1UP')
    if (oneUp) {
      const winners = oneUp.leadingTeam === 'ca' ? oneUp.teamA : oneUp.teamB
      recap += `${winners.join(' & ')} gutted out a 1UP victory in a battle that had the gallery on edge.\n\n`
    }
  }

  // Dramatic close
  if (leader) {
    const trailing = leader === 'Drifters' ? 'Grifters' : 'Drifters'
    recap += `${trailing} will need to regroup. ${leader} has the momentum, the swagger, and right now — the valley.\n\n`
  } else {
    recap += `This Cup is far from over. The valley holds its breath.\n\n`
  }

  recap += `CA ${caWins} — PDX ${pdxWins}`
  if (ties > 0) recap += ` (${ties} halved)`

  return recap
}

export default function RoundRecap({ round, onClose }) {
  const [recap, setRecap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [displayedChars, setDisplayedChars] = useState(0)

  async function handleGenerate() {
    setLoading(true)

    // Generate client-side recap (Anthropic API doesn't support browser CORS)
    const text = generateRecap(round)
    setRecap(text)
    setLoading(false)

    // Typewriter effect
    let i = 0
    const interval = setInterval(() => {
      i += 2
      setDisplayedChars(i)
      if (i >= text.length) clearInterval(interval)
    }, 15)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 70%)' }}
    >
      <div className="max-w-[430px] w-full mx-auto flex items-center justify-between px-5 pt-6 pb-3">
        <h2 className="text-[16px] font-bold tracking-[0.12em] uppercase text-accent-warm flex items-center gap-2">
          <Sparkles size={18} className="text-accent-warm" />
          Round {round.id} Recap
        </h2>
        <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary transition-colors">
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-w-[430px] w-full mx-auto px-5 pb-24">
        {!recap && !loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Sparkles size={32} className="text-accent-warm mb-4" />
            <p className="text-[14px] text-text-secondary text-center mb-6">
              Generate an ESPN-style dramatic recap of {round.name}
            </p>
            <button
              onClick={handleGenerate}
              className="rounded-xl px-6 py-3 bg-accent-warm text-bg-primary font-bold text-[14px] tracking-wider uppercase transition-opacity hover:opacity-90"
            >
              Generate Recap
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-accent-warm/30 border-t-accent-warm rounded-full animate-spin mb-4" />
            <p className="text-[13px] text-text-muted">Generating recap...</p>
          </div>
        )}

        {recap && (
          <div
            className="rounded-xl px-4 py-4"
            style={{
              background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
              border: '1px solid #2A2A2E',
            }}
          >
            <pre className="text-[14px] text-text-secondary leading-relaxed whitespace-pre-wrap font-sans">
              {recap.slice(0, displayedChars)}
              {displayedChars < recap.length && (
                <span className="inline-block w-0.5 h-4 bg-accent-warm animate-pulse-live ml-0.5 align-middle" />
              )}
            </pre>
          </div>
        )}
      </div>

      {recap && (
        <div className="fixed bottom-0 left-0 right-0 bg-bg-secondary/95 backdrop-blur-sm border-t border-surface-border">
          <div className="max-w-[430px] mx-auto px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
            <button
              onClick={onClose}
              className="w-full rounded-xl py-3 bg-accent-warm text-bg-primary font-bold text-[14px] tracking-wider uppercase transition-opacity hover:opacity-90"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
