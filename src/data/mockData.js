export const eventData = {
  title: 'RALLY IN THE VALLEY',
  day: 1,
  session: 'Afternoon Matches',
}

export const scores = {
  ca: 9.5,
  pdx: 8.5,
}

export const matches = [
  {
    id: 1,
    teamA: ['Brandon', 'Aaron'],
    teamB: ['Nick', 'Rob'],
    status: '2UP',
    thru: 11,
    leadingTeam: 'ca',
  },
  {
    id: 2,
    teamA: ['Jamie', 'Eddie'],
    teamB: ['Kate', 'Kristen'],
    status: 'AS',
    thru: 14,
    leadingTeam: null,
  },
  {
    id: 3,
    teamA: ['Bryan', 'Seth'],
    teamB: ['Dan', 'Mike'],
    status: '1DN',
    thru: 14,
    leadingTeam: 'pdx',
  },
]

export const leaderboard = [
  { rank: 1, name: 'Brandon', points: '+2.5', team: 'ca' },
  { rank: 2, name: 'Aaron', points: '+2.0', team: 'ca' },
  { rank: 3, name: 'Nick', points: '+1.5', team: 'pdx' },
  { rank: 4, name: 'Jamie', points: '+1.0', team: 'ca' },
  { rank: 5, name: 'Kate', points: '+0.5', team: 'pdx' },
]

export const feed = [
  {
    id: 1,
    author: 'Brandon',
    message: 'PDX looking shaky early…',
    team: 'ca',
    time: '2m ago',
  },
  {
    id: 2,
    author: 'Nick',
    message: "Let's see if CA can hold the lead 😉",
    team: 'pdx',
    time: '8m ago',
  },
]
