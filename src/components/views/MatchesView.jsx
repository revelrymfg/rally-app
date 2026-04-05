import { useState } from 'react'
import { Trophy } from 'lucide-react'
import SectionHeader from '../SectionHeader'
import MatchCard from '../MatchCard'
import AwardsVoting from '../AwardsVoting'
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
            <VoteButton round={round} currentUser={currentUser} onOpen={() => setVotingRound(round)} />
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
    </div>
  )
}
