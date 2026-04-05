import { useState } from 'react'
import { Trophy, Sparkles } from 'lucide-react'
import SectionHeader from '../SectionHeader'
import MatchCard from '../MatchCard'
import AwardsVoting from '../AwardsVoting'
import RoundRecap from '../RoundRecap'
import { rounds } from '../../data/mockData'
import { useVotes } from '../../hooks/useFirestore'

function VoteButton({ round, currentUser, onOpen }) {
  const { getMyVotes } = useVotes(round.id)
  const myVotes = getMyVotes(currentUser?.name)
  const voted = Object.keys(myVotes).length > 0

  return (
    <button
      onClick={onOpen}
      className="mx-5 mt-2 w-[calc(100%-2.5rem)] rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      style={{
        background: 'linear-gradient(135deg, #2a2520 0%, #1f1b17 100%)',
        border: '1px solid #C2B8A344',
        boxShadow: 'inset 0 1px 0 rgba(194,184,163,0.08)',
      }}
    >
      <Trophy size={16} className="text-accent-warm" />
      <span className="text-[13px] font-semibold tracking-wider uppercase text-accent-warm">
        {voted ? 'Change Your Votes' : 'Vote for Awards'}
      </span>
    </button>
  )
}

export default function MatchesView({ currentUser }) {
  const [votingRound, setVotingRound] = useState(null)
  const [recapRound, setRecapRound] = useState(null)

  return (
    <div className="pt-6">
      <h2 className="text-[18px] font-bold tracking-[0.15em] uppercase text-accent-warm text-center mb-4">
        All Matches
      </h2>

      {rounds.map((round) => (
        <div key={round.id} className="mb-4">
          <SectionHeader title={round.name} live={round.status === 'live'} />
          {round.matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}

          {round.status === 'complete' && (
            <div className="flex gap-2 mx-5 mt-2">
              <button
                onClick={() => setVotingRound(round)}
                className="flex-1 rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #2a2520 0%, #1f1b17 100%)',
                  border: '1px solid #C2B8A344',
                  boxShadow: 'inset 0 1px 0 rgba(194,184,163,0.08)',
                }}
              >
                <Trophy size={14} className="text-accent-warm" />
                <span className="text-[12px] font-semibold tracking-wider uppercase text-accent-warm">
                  Awards
                </span>
              </button>
              <button
                onClick={() => setRecapRound(round)}
                className="flex-1 rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #1a2025 0%, #151a1f 100%)',
                  border: '1px solid #2A2A2E',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                <Sparkles size={14} className="text-team-blue" />
                <span className="text-[12px] font-semibold tracking-wider uppercase text-text-secondary">
                  Recap
                </span>
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="h-8" />

      {votingRound && (
        <AwardsVoting
          roundId={votingRound.id}
          roundName={votingRound.name}
          currentUser={currentUser}
          onClose={() => setVotingRound(null)}
        />
      )}

      {recapRound && (
        <RoundRecap
          round={recapRound}
          onClose={() => setRecapRound(null)}
        />
      )}
    </div>
  )
}
