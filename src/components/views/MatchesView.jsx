import { useState } from 'react'
import { Trophy, Sparkles } from 'lucide-react'
import SectionHeader from '../SectionHeader'
import MatchCard from '../MatchCard'
import AwardsVoting from '../AwardsVoting'
import RoundRecap from '../RoundRecap'
import PairingsButton from '../PairingsButton'
import ScoreEntry from '../ScoreEntry'
import { playerShortNames } from '../../data/mockData'
import { useVotes } from '../../hooks/useFirestore'
import { useMatches, ROUND_INFO } from '../../hooks/useMatches'

// Convert a Firestore match doc to the shape MatchCard expects
function toMatchCard(m) {
  const toShort = (fullName) =>
    fullName == null ? '?' : (playerShortNames[fullName] || fullName.split(' ')[0])
  return {
    ...m,
    teamA: (m.teamA || []).filter(Boolean).map(toShort),
    teamB: (m.teamB || []).filter(Boolean).map(toShort),
  }
}

// A round is "complete" when it has published matches and all are final
function roundStatus(matches) {
  if (matches.length === 0) return 'upcoming'
  if (matches.every((m) => m.thru === 'F' || m.thru === 'FINAL')) return 'complete'
  if (matches.some((m) => m.thru !== '-' && m.thru != null)) return 'live'
  return 'upcoming'
}

function VoteButton({ round, currentUser, onOpen }) {
  const { getMyVotes } = useVotes(round.id)
  const myVotes = getMyVotes(currentUser?.name)
  const voted = Object.keys(myVotes).length > 0

  return (
    <button
      onClick={onOpen}
      className="flex-1 rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      style={{
        background: 'linear-gradient(135deg, #2a2520 0%, #1f1b17 100%)',
        border: '1px solid #C2B8A344',
        boxShadow: 'inset 0 1px 0 rgba(194,184,163,0.08)',
      }}
    >
      <Trophy size={14} className="text-accent-warm" />
      <span className="text-[12px] font-semibold tracking-wider uppercase text-accent-warm">
        {voted ? 'Change Votes' : 'Awards'}
      </span>
    </button>
  )
}

export default function MatchesView({ currentUser }) {
  const [votingRound, setVotingRound] = useState(null)
  const [recapRound, setRecapRound] = useState(null)
  const [scoringMatch, setScoringMatch] = useState(null)
  const { publishedMatchesByRound } = useMatches()

  return (
    <div className="pt-6">
      <h2 className="text-[18px] font-bold tracking-[0.15em] uppercase text-accent-warm text-center mb-4">
        All Matches
      </h2>

      {/* Admin pairings manager entry */}
      <PairingsButton />

      <p className="text-[11px] text-text-muted text-center mb-3 tracking-wider">
        Tap a match to enter scores
      </p>

      {ROUND_INFO.map((info) => {
        const matches = publishedMatchesByRound(info.id)
        const status = roundStatus(matches)
        const roundForModal = { id: info.id, name: info.name, status, matches }

        return (
          <div key={info.id} className="mb-4">
            <SectionHeader title={info.name} live={status === 'live'} />
            {matches.length === 0 ? (
              <p className="text-[12px] text-text-muted text-center py-3 mx-5">
                Pairings not yet posted
              </p>
            ) : (
              matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={toMatchCard(match)}
                  onClick={() => setScoringMatch(match)}
                />
              ))
            )}

            {status === 'complete' && (
              <div className="flex gap-2 mx-5 mt-2">
                <VoteButton round={roundForModal} currentUser={currentUser} onOpen={() => setVotingRound(roundForModal)} />
                <button
                  onClick={() => setRecapRound(roundForModal)}
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
        )
      })}

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
          round={{ ...recapRound, matches: recapRound.matches.map(toMatchCard) }}
          onClose={() => setRecapRound(null)}
        />
      )}

      {scoringMatch && (
        <ScoreEntry
          match={scoringMatch}
          onClose={() => setScoringMatch(null)}
        />
      )}
    </div>
  )
}
