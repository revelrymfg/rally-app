import EventHeader from '../EventHeader'
import ScoreHero from '../ScoreHero'
import SectionHeader from '../SectionHeader'
import MatchCard from '../MatchCard'
import LeaderboardList from '../LeaderboardList'
import FeedCard from '../FeedCard'
import AwardWinners, { useHasAwardVotes } from '../AwardWinners'
import SideGames from '../SideGames'
import MomentumBar from '../MomentumBar'
import DraftButton from '../DraftButton'
import ResetTournament from '../ResetTournament'
import { useFeed } from '../../hooks/useFirestore'
import { useMatches, getRoundInfo } from '../../hooks/useMatches'
import { useUserTeam } from '../../hooks/useUserTeam'
import { eventData, scores, leaderboard, playerShortNames } from '../../data/mockData'

function toShort(fullName) {
  return fullName == null ? '?' : (playerShortNames[fullName] || fullName.split(' ')[0])
}

function toMatchCard(m) {
  return {
    ...m,
    teamA: (m.teamA || []).filter(Boolean).map(toShort),
    teamB: (m.teamB || []).filter(Boolean).map(toShort),
  }
}

export default function HomeView({ currentUser }) {
  const { posts: feedPosts } = useFeed()
  const hasAwards = useHasAwardVotes()
  const { matches: allMatches } = useMatches()
  const userTeam = useUserTeam(currentUser)
  const shortName = currentUser ? playerShortNames[currentUser.name] || currentUser.name.split(' ')[0] : null
  const teamLabel = userTeam === 'ca' ? 'CA' : userTeam === 'pdx' ? 'PDX' : 'Team TBD'
  const teamColor = userTeam === 'ca' ? '#C8102E' : userTeam === 'pdx' ? '#003DA5' : '#6B7280'

  // Find the user's current match — prefer live, fall back to most recent round that has their match
  let userMatch = null
  let userMatchRound = null
  if (shortName) {
    const published = allMatches.filter((m) => m.published)
    // Find any non-final match they're in
    const live = published.find(
      (m) =>
        (m.thru !== 'F' && m.thru !== 'FINAL') &&
        ((m.teamA || []).includes(shortName) || (m.teamB || []).includes(shortName)),
    )
    if (live) {
      userMatch = live
    } else {
      // Fall back to earliest round where user has a match
      userMatch = published.find(
        (m) => (m.teamA || []).includes(shortName) || (m.teamB || []).includes(shortName),
      )
    }
    if (userMatch) {
      userMatchRound = getRoundInfo(userMatch.roundId)
    }
  }

  // Live section: any published, non-final match
  const liveMatches = allMatches.filter(
    (m) => m.published && m.thru !== 'F' && m.thru !== 'FINAL',
  )

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
          {userMatch ? (
            <p className="text-[14px] text-text-primary font-medium">
              {userMatchRound ? `Round ${userMatchRound.id}: ` : ''}
              {(userMatch.teamA || []).filter(Boolean).map(toShort).join(' & ')}
              {' vs '}
              {(userMatch.teamB || []).filter(Boolean).map(toShort).join(' & ')}
              {(userMatch.thru === 'F' || userMatch.thru === 'FINAL') && (
                <span className="text-text-muted text-[12px] ml-2">
                  ({userMatch.status})
                </span>
              )}
            </p>
          ) : (
            <p className="text-[13px] text-text-muted">Pairings not yet posted</p>
          )}
        </div>
      )}

      <DraftButton />

      <MomentumBar />

      {liveMatches.length > 0 && (
        <>
          <SectionHeader title="Live" live />
          {liveMatches.map((match) => (
            <MatchCard key={match.id} match={toMatchCard(match)} />
          ))}
        </>
      )}

      {leaderboard.length > 0 && (
        <>
          <SectionHeader title="Leaderboard" />
          <LeaderboardList players={leaderboard} />
        </>
      )}

      <SectionHeader title="Side Games" />
      <SideGames />

      {hasAwards && (
        <>
          <SectionHeader title="Awards" />
          <AwardWinners />
        </>
      )}

      {feedPosts.length > 0 && (
        <>
          <SectionHeader title="Feed" />
          {feedPosts.slice(0, 3).map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </>
      )}

      <ResetTournament />

      <div className="h-8" />
    </>
  )
}
