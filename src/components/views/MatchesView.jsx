import SectionHeader from '../SectionHeader'
import MatchCard from '../MatchCard'
import { rounds } from '../../data/mockData'

export default function MatchesView() {
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
        </div>
      ))}

      <div className="h-8" />
    </div>
  )
}
