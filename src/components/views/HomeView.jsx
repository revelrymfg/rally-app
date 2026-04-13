import EventHeader from '../EventHeader'
import ScoreHero from '../ScoreHero'
import SectionHeader from '../SectionHeader'
import MatchCard from '../MatchCard'
import LeaderboardList from '../LeaderboardList'
import FeedCard from '../FeedCard'
import AwardWinners from '../AwardWinners'
import SideGames from '../SideGames'
import MomentumBar from '../MomentumBar'
import DraftButton from '../DraftButton'
import { useFeed } from '../../hooks/useFirestore'
import { eventData, scores, matches, leaderboard, rounds, playerShortNames } from '../../data/mockData'

export default function HomeView({ currentUser }) {
  const { posts: feedPosts } = useFeed()
  const shortName = currentUser ? playerShortNames[currentUser.name] || currentUser.name.split(' ')[0] : null
  const teamLabel = currentUser?.team === 'ca' ? 'CA' : 'PDX'
  const teamColor = currentUser?.team === 'ca' ? '#C8102E' : '#003DA5'

  // Find Round 1 pairing
  let round1Match = null
  if (shortName && rounds[0]) {
    round1Match = rounds[0].matches.find(
      (m) => m.teamA.includes(shortName) || m.teamB.includes(shortName)
    )
  }

  return (
    <>
      <EventHeader />
      <ScoreHero scores={scores} day={eventData.day} session={eventData.session} />

      {/* Personal card */}
      {currentUser && (
        <div
          className="mx-5 mb-4 rounded-xl px-4 py-3.5"
          style={{
            background: 'linear-gradient(135deg, #1C1C1F 0%, #19191C 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.3)',
            borderLeft: `3px solid ${teamColor}`,
            border: '1px solid #2A2A2E',
            borderLeftColor: teamColor,
            borderLeftWidth: 3,
          }}
        >
          <p className="text-[13px] text-text-secondary mb-1">
            You're playing for{' '}
            <span className="font-bold" style={{ color: teamColor }}>
              {teamLabel}
            </span>
          </p>
          {round1Match ? (
            <p className="text-[14px] text-text-primary font-medium">
              Round 1: {round1Match.teamA.join(' & ')} vs {round1Match.teamB.join(' & ')}
              {round1Match.thru === 'F' && (
                <span className="text-text-muted text-[12px] ml-2">
                  ({round1Match.status})
                </span>
              )}
            </p>
          ) : (
            <p className="text-[13px] text-text-muted">No Round 1 pairing found</p>
          )}
        </div>
      )}

      <DraftButton />

      <MomentumBar />

      <SectionHeader title="Live" live />
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}

      <SectionHeader title="Leaderboard" />
      <LeaderboardList players={leaderboard} />

      <SectionHeader title="Side Games" />
      <SideGames />

      <SectionHeader title="Awards" />
      <AwardWinners />

      <SectionHeader title="Feed" />
      {feedPosts.slice(0, 3).map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}

      <div className="h-8" />
    </>
  )
}
