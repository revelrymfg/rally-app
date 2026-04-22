import { useState } from 'react'
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
import ScoreEntry from '../ScoreEntry'
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
  const [scoringMatch, setScoringMatch] = useState(null)
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('draftAdmin') === 'true'
  const teamLabel = userTeam === 'ca' ? 'Drifters' : userTeam === 'pdx' ? 'Grifters' : 'Team TBD'
  const teamColor = userTeam === 'ca' ? '#C8102E' : userTeam === 'pdx' ? '#003DA5' : '#6B7280'

  // Find the user's current match using their FULL name (Firestore stores full names)
  const fullName = currentUser?.name
  let userMatch = null
  let userMatchRound = null
  let userPartners = []
  let userOpponents = []

  if (fullName) {
    const published = allMatches.filter((m) => m.published)
    const userInMatch = (m) =>
      (m.teamA || []).includes(fullName) || (m.teamB || []).includes(fullName)

    // Prefer a live (non-final) match; fall back to any published match they're in
    const live = published.find(
      (m) => (m.thru !== 'F' && m.thru !== 'FINAL') && userInMatch(m),
    )
    userMatch = live || published.find(userInMatch) || null

    if (userMatch) {
      userMatchRound = getRoundInfo(userMatch.roundId)
      const teamA = (userMatch.teamA || []).filter(Boolean)
      const teamB = (userMatch.teamB || []).filter(Boolean)
      const onA = teamA.includes(fullName)
      userPartners = (onA ? teamA : teamB).filter((n) => n !== fullName)
      userOpponents = onA ? teamB : teamA
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
            <>
              {userMatchRound && (
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted mb-1 mt-1">
                  Round {userMatchRound.id}
                </p>
              )}
              <p className="text-[14px] text-text-primary font-medium leading-snug">
                {userPartners.length > 0 ? (
                  <>
                    You're paired with{' '}
                    <span className="font-bold">
                      {userPartners.map(toShort).join(' & ')}
                    </span>
                  </>
                ) : (
                  <>Your match</>
                )}
                {' '}
                <span className="text-text-muted">vs</span>{' '}
                <span className="font-bold">
                  {userOpponents.map(toShort).join(' & ')}
                </span>
                {(userMatch.thru === 'F' || userMatch.thru === 'FINAL') && (
                  <span className="text-text-muted text-[12px] ml-1.5">
                    ({userMatch.status})
                  </span>
                )}
              </p>
            </>
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
            <MatchCard
              key={match.id}
              match={toMatchCard(match)}
              onClick={() => setScoringMatch(match)}
            />
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

      {scoringMatch && (
        <ScoreEntry
          match={scoringMatch}
          readOnly={!isAdmin}
          onClose={() => setScoringMatch(null)}
        />
      )}
    </>
  )
}
