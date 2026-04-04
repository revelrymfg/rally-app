export const eventData = {
  title: 'RALLY IN THE VALLEY',
  day: 1,
  session: 'Afternoon Matches',
}

export const scores = {
  ca: 9.5,
  pdx: 8.5,
}

// Current live matches (shown on Home)
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

// All rounds
export const rounds = [
  {
    id: 1,
    name: 'Round 1 — Four-Ball',
    status: 'complete',
    matches: [
      { id: 101, teamA: ['Brandon', 'Aaron'], teamB: ['Nick', 'Rob'], status: '3&2', thru: 'F', leadingTeam: 'ca' },
      { id: 102, teamA: ['Jamie', 'Eddie'], teamB: ['Dan', 'Mike'], status: '1UP', thru: 'F', leadingTeam: 'ca' },
      { id: 103, teamA: ['Bryan', 'Seth'], teamB: ['Kate', 'Kristen'], status: '2&1', thru: 'F', leadingTeam: 'pdx' },
      { id: 104, teamA: ['Tony', 'Derek'], teamB: ['Sam', 'Chris'], status: 'AS', thru: 'F', leadingTeam: null },
      { id: 105, teamA: ['Wes', 'Marco'], teamB: ['Tyler', 'Drew'], status: '1UP', thru: 'F', leadingTeam: 'ca' },
      { id: 106, teamA: ['Luke', 'Eli'], teamB: ['Jake', 'Cody'], status: '2UP', thru: 'F', leadingTeam: 'pdx' },
    ],
  },
  {
    id: 2,
    name: 'Round 2 — Foursomes',
    status: 'complete',
    matches: [
      { id: 201, teamA: ['Brandon', 'Jamie'], teamB: ['Nick', 'Dan'], status: '2&1', thru: 'F', leadingTeam: 'ca' },
      { id: 202, teamA: ['Aaron', 'Bryan'], teamB: ['Rob', 'Kate'], status: '1UP', thru: 'F', leadingTeam: 'pdx' },
      { id: 203, teamA: ['Eddie', 'Seth'], teamB: ['Kristen', 'Mike'], status: '3&2', thru: 'F', leadingTeam: 'ca' },
      { id: 204, teamA: ['Tony', 'Wes'], teamB: ['Sam', 'Tyler'], status: '1UP', thru: 'F', leadingTeam: 'pdx' },
      { id: 205, teamA: ['Derek', 'Marco'], teamB: ['Chris', 'Drew'], status: 'AS', thru: 'F', leadingTeam: null },
      { id: 206, teamA: ['Luke', 'Eli'], teamB: ['Jake', 'Cody'], status: '1UP', thru: 'F', leadingTeam: 'ca' },
    ],
  },
  {
    id: 3,
    name: 'Round 3 — Singles',
    status: 'live',
    matches: [
      { id: 301, teamA: ['Brandon'], teamB: ['Nick'], status: '2UP', thru: 11, leadingTeam: 'ca' },
      { id: 302, teamA: ['Aaron'], teamB: ['Rob'], status: '1UP', thru: 13, leadingTeam: 'ca' },
      { id: 303, teamA: ['Jamie'], teamB: ['Kate'], status: 'AS', thru: 14, leadingTeam: null },
      { id: 304, teamA: ['Eddie'], teamB: ['Kristen'], status: 'AS', thru: 12, leadingTeam: null },
      { id: 305, teamA: ['Bryan'], teamB: ['Dan'], status: '1DN', thru: 14, leadingTeam: 'pdx' },
      { id: 306, teamA: ['Seth'], teamB: ['Mike'], status: '3UP', thru: 10, leadingTeam: 'ca' },
      { id: 307, teamA: ['Tony'], teamB: ['Sam'], status: '1UP', thru: 11, leadingTeam: 'pdx' },
      { id: 308, teamA: ['Derek'], teamB: ['Chris'], status: '2UP', thru: 9, leadingTeam: 'ca' },
      { id: 309, teamA: ['Wes'], teamB: ['Tyler'], status: '1DN', thru: 13, leadingTeam: 'pdx' },
      { id: 310, teamA: ['Marco'], teamB: ['Drew'], status: 'AS', thru: 11, leadingTeam: null },
      { id: 311, teamA: ['Luke'], teamB: ['Jake'], status: '1UP', thru: 8, leadingTeam: 'ca' },
      { id: 312, teamA: ['Eli'], teamB: ['Cody'], status: '2DN', thru: 12, leadingTeam: 'pdx' },
      { id: 313, teamA: ['Nate'], teamB: ['Ryan'], status: '1UP', thru: 7, leadingTeam: 'ca' },
      { id: 314, teamA: ['Jared'], teamB: ['Kyle'], status: 'AS', thru: 6, leadingTeam: null },
    ],
  },
]

// All 28 players
export const players = [
  // CA (14 players)
  { name: 'Brandon', team: 'ca', handicap: 8, wins: 3, losses: 0, draws: 0 },
  { name: 'Aaron', team: 'ca', handicap: 10, wins: 2, losses: 1, draws: 0 },
  { name: 'Jamie', team: 'ca', handicap: 12, wins: 2, losses: 0, draws: 1 },
  { name: 'Eddie', team: 'ca', handicap: 14, wins: 2, losses: 0, draws: 1 },
  { name: 'Bryan', team: 'ca', handicap: 9, wins: 1, losses: 1, draws: 1 },
  { name: 'Seth', team: 'ca', handicap: 11, wins: 2, losses: 0, draws: 1 },
  { name: 'Tony', team: 'ca', handicap: 15, wins: 0, losses: 1, draws: 1 },
  { name: 'Derek', team: 'ca', handicap: 13, wins: 1, losses: 0, draws: 1 },
  { name: 'Wes', team: 'ca', handicap: 7, wins: 1, losses: 1, draws: 0 },
  { name: 'Marco', team: 'ca', handicap: 16, wins: 1, losses: 0, draws: 1 },
  { name: 'Luke', team: 'ca', handicap: 10, wins: 1, losses: 1, draws: 0 },
  { name: 'Eli', team: 'ca', handicap: 18, wins: 0, losses: 1, draws: 1 },
  { name: 'Nate', team: 'ca', handicap: 12, wins: 0, losses: 0, draws: 0 },
  { name: 'Jared', team: 'ca', handicap: 14, wins: 0, losses: 0, draws: 0 },

  // PDX (14 players)
  { name: 'Nick', team: 'pdx', handicap: 6, wins: 1, losses: 2, draws: 0 },
  { name: 'Rob', team: 'pdx', handicap: 11, wins: 1, losses: 1, draws: 1 },
  { name: 'Kate', team: 'pdx', handicap: 9, wins: 1, losses: 1, draws: 1 },
  { name: 'Kristen', team: 'pdx', handicap: 13, wins: 1, losses: 1, draws: 1 },
  { name: 'Dan', team: 'pdx', handicap: 10, wins: 1, losses: 1, draws: 0 },
  { name: 'Mike', team: 'pdx', handicap: 15, wins: 0, losses: 2, draws: 0 },
  { name: 'Sam', team: 'pdx', handicap: 12, wins: 1, losses: 0, draws: 1 },
  { name: 'Chris', team: 'pdx', handicap: 8, wins: 0, losses: 1, draws: 1 },
  { name: 'Tyler', team: 'pdx', handicap: 14, wins: 1, losses: 1, draws: 0 },
  { name: 'Drew', team: 'pdx', handicap: 17, wins: 0, losses: 1, draws: 1 },
  { name: 'Jake', team: 'pdx', handicap: 11, wins: 1, losses: 1, draws: 0 },
  { name: 'Cody', team: 'pdx', handicap: 16, wins: 1, losses: 0, draws: 1 },
  { name: 'Ryan', team: 'pdx', handicap: 10, wins: 0, losses: 0, draws: 0 },
  { name: 'Kyle', team: 'pdx', handicap: 13, wins: 0, losses: 0, draws: 0 },
]

export const leaderboard = [
  { rank: 1, name: 'Brandon', points: '+2.5', team: 'ca' },
  { rank: 2, name: 'Aaron', points: '+2.0', team: 'ca' },
  { rank: 3, name: 'Nick', points: '+1.5', team: 'pdx' },
  { rank: 4, name: 'Jamie', points: '+1.0', team: 'ca' },
  { rank: 5, name: 'Kate', points: '+0.5', team: 'pdx' },
]

export const feed = [
  { id: 1, author: 'Brandon', message: 'PDX looking shaky early…', team: 'ca', time: '2m ago' },
  { id: 2, author: 'Nick', message: "Let's see if CA can hold the lead 😉", team: 'pdx', time: '8m ago' },
  { id: 3, author: 'Seth', message: '3UP through 10. Feeling dangerous 🔥', team: 'ca', time: '12m ago' },
  { id: 4, author: 'Kate', message: 'All square and grinding. Love this format.', team: 'pdx', time: '18m ago' },
  { id: 5, author: 'Eddie', message: 'Foursomes was brutal but we survived', team: 'ca', time: '25m ago' },
  { id: 6, author: 'Dan', message: 'Bryan is cooked. 1DN and fading 📉', team: 'pdx', time: '31m ago' },
  { id: 7, author: 'Aaron', message: 'Rob cannot putt today. Sad to see it.', team: 'ca', time: '40m ago' },
  { id: 8, author: 'Tyler', message: 'Wes has no answer for the back nine', team: 'pdx', time: '52m ago' },
]
