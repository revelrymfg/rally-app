import EventHeader from '../EventHeader'
import ScoreHero from '../ScoreHero'
import SectionHeader from '../SectionHeader'
import MatchCard from '../MatchCard'
import LeaderboardList from '../LeaderboardList'
import FeedCard from '../FeedCard'
import { eventData, scores, matches, leaderboard, feed } from '../../data/mockData'

export default function HomeView() {
  return (
    <>
      <EventHeader />
      <ScoreHero scores={scores} day={eventData.day} session={eventData.session} />

      <SectionHeader title="Live" live />
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}

      <SectionHeader title="Leaderboard" />
      <LeaderboardList players={leaderboard} />

      <SectionHeader title="Feed" />
      {feed.slice(0, 3).map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}

      <div className="h-8" />
    </>
  )
}
