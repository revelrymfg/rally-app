import AppShell from './components/AppShell'
import EventHeader from './components/EventHeader'
import ScoreHero from './components/ScoreHero'
import SectionHeader from './components/SectionHeader'
import MatchCard from './components/MatchCard'
import LeaderboardList from './components/LeaderboardList'
import FeedCard from './components/FeedCard'
import { eventData, scores, matches, leaderboard, feed } from './data/mockData'

export default function App() {
  return (
    <AppShell>
      <EventHeader />
      <ScoreHero scores={scores} day={eventData.day} session={eventData.session} />

      <SectionHeader title="Live" live />
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}

      <SectionHeader title="Leaderboard" />
      <LeaderboardList players={leaderboard} />

      <SectionHeader title="Feed" />
      {feed.map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}

      {/* Spacer for bottom nav */}
      <div className="h-8" />
    </AppShell>
  )
}
