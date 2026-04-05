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
    teamA: ['Micah P.', 'James'],
    teamB: ['Patrick', 'Aaron K.'],
    status: '2UP',
    thru: 11,
    leadingTeam: 'ca',
  },
  {
    id: 2,
    teamA: ['Todd', 'John'],
    teamB: ['Micah B.', 'Scott'],
    status: 'AS',
    thru: 14,
    leadingTeam: null,
  },
  {
    id: 3,
    teamA: ['Brian', 'Kelso'],
    teamB: ['Reid', 'Brandon L.'],
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
      { id: 101, teamA: ['Micah P.', 'James'], teamB: ['Patrick', 'Aaron K.'], status: '3&2', thru: 'F', leadingTeam: 'ca' },
      { id: 102, teamA: ['Todd', 'John'], teamB: ['Micah B.', 'Scott'], status: '1UP', thru: 'F', leadingTeam: 'ca' },
      { id: 103, teamA: ['Brian', 'Kelso'], teamB: ['Reid', 'Brandon L.'], status: '2&1', thru: 'F', leadingTeam: 'pdx' },
      { id: 104, teamA: ['Matt', 'Nick D.'], teamB: ['Joseph', 'Luis'], status: 'AS', thru: 'F', leadingTeam: null },
      { id: 105, teamA: ['Rob D.', 'Connor'], teamB: ['Darren', 'Brandon B.'], status: '1UP', thru: 'F', leadingTeam: 'ca' },
      { id: 106, teamA: ['Ali', 'Jason'], teamB: ['Travis', 'Troy'], status: '2UP', thru: 'F', leadingTeam: 'pdx' },
    ],
  },
  {
    id: 2,
    name: 'Round 2 — Foursomes',
    status: 'complete',
    matches: [
      { id: 201, teamA: ['Micah P.', 'Todd'], teamB: ['Patrick', 'Micah B.'], status: '2&1', thru: 'F', leadingTeam: 'ca' },
      { id: 202, teamA: ['James', 'Brian'], teamB: ['Aaron K.', 'Reid'], status: '1UP', thru: 'F', leadingTeam: 'pdx' },
      { id: 203, teamA: ['John', 'Kelso'], teamB: ['Scott', 'Brandon L.'], status: '3&2', thru: 'F', leadingTeam: 'ca' },
      { id: 204, teamA: ['Matt', 'Rob D.'], teamB: ['Joseph', 'Darren'], status: '1UP', thru: 'F', leadingTeam: 'pdx' },
      { id: 205, teamA: ['Nick D.', 'Connor'], teamB: ['Luis', 'Brandon B.'], status: 'AS', thru: 'F', leadingTeam: null },
      { id: 206, teamA: ['Ali', 'Robby'], teamB: ['Travis', 'Troy'], status: '1UP', thru: 'F', leadingTeam: 'ca' },
    ],
  },
  {
    id: 3,
    name: 'Round 3 — Singles',
    status: 'live',
    matches: [
      { id: 301, teamA: ['Micah P.'], teamB: ['Patrick'], status: '2UP', thru: 11, leadingTeam: 'ca' },
      { id: 302, teamA: ['James'], teamB: ['Aaron K.'], status: '1UP', thru: 13, leadingTeam: 'ca' },
      { id: 303, teamA: ['Todd'], teamB: ['Micah B.'], status: 'AS', thru: 14, leadingTeam: null },
      { id: 304, teamA: ['John'], teamB: ['Scott'], status: 'AS', thru: 12, leadingTeam: null },
      { id: 305, teamA: ['Brian'], teamB: ['Reid'], status: '1DN', thru: 14, leadingTeam: 'pdx' },
      { id: 306, teamA: ['Kelso'], teamB: ['Brandon L.'], status: '3UP', thru: 10, leadingTeam: 'ca' },
      { id: 307, teamA: ['Matt'], teamB: ['Joseph'], status: '1UP', thru: 11, leadingTeam: 'pdx' },
      { id: 308, teamA: ['Nick D.'], teamB: ['Luis'], status: '2UP', thru: 9, leadingTeam: 'ca' },
      { id: 309, teamA: ['Rob D.'], teamB: ['Darren'], status: '1DN', thru: 13, leadingTeam: 'pdx' },
      { id: 310, teamA: ['Connor'], teamB: ['Brandon B.'], status: 'AS', thru: 11, leadingTeam: null },
      { id: 311, teamA: ['Ali'], teamB: ['Travis'], status: '1UP', thru: 8, leadingTeam: 'ca' },
      { id: 312, teamA: ['Jason'], teamB: ['Troy'], status: '2DN', thru: 12, leadingTeam: 'pdx' },
      { id: 313, teamA: ['Robby'], teamB: ['TBD'], status: '-', thru: '-', leadingTeam: null },
    ],
  },
]

// All 25 players
export const players = [
  // CA (13 players)
  { name: 'Micah Pueschel', team: 'ca', handicap: 8, wins: 3, losses: 0, draws: 0 },
  { name: 'James Menke', team: 'ca', handicap: 10, wins: 2, losses: 1, draws: 0 },
  { name: 'Todd Howe', team: 'ca', handicap: 12, wins: 2, losses: 0, draws: 1 },
  { name: 'John Paik', team: 'ca', handicap: 14, wins: 1, losses: 0, draws: 2 },
  { name: 'Brian Humphrey', team: 'ca', handicap: 9, wins: 1, losses: 1, draws: 1 },
  { name: 'Kelso Davis', team: 'ca', handicap: 11, wins: 2, losses: 0, draws: 1 },
  { name: 'Matt Mendoza', team: 'ca', handicap: 15, wins: 0, losses: 1, draws: 1 },
  { name: 'Nick DeRosa', team: 'ca', handicap: 13, wins: 1, losses: 0, draws: 1 },
  { name: 'Rob Donegan', team: 'ca', handicap: 7, wins: 1, losses: 1, draws: 0 },
  { name: 'Connor McLaughlin', team: 'ca', handicap: 16, wins: 1, losses: 0, draws: 1 },
  { name: 'Ali', team: 'ca', handicap: 10, wins: 1, losses: 1, draws: 0 },
  { name: 'Jason Jackson', team: 'ca', handicap: 18, wins: 0, losses: 1, draws: 1 },
  { name: 'Robby Keilch', team: 'ca', handicap: 12, wins: 1, losses: 0, draws: 0 },

  // PDX (12 players)
  { name: 'Patrick Wolfe', team: 'pdx', handicap: 6, wins: 1, losses: 2, draws: 0 },
  { name: 'Aaron Kramer', team: 'pdx', handicap: 11, wins: 1, losses: 1, draws: 1 },
  { name: 'Micah Brown', team: 'pdx', handicap: 9, wins: 1, losses: 1, draws: 1 },
  { name: 'Scott Owen', team: 'pdx', handicap: 13, wins: 1, losses: 1, draws: 1 },
  { name: 'Reid Vale', team: 'pdx', handicap: 10, wins: 1, losses: 1, draws: 0 },
  { name: 'Brandon Lehmann', team: 'pdx', handicap: 15, wins: 1, losses: 1, draws: 0 },
  { name: 'Joseph Kim', team: 'pdx', handicap: 12, wins: 1, losses: 0, draws: 1 },
  { name: 'Luis Lopez', team: 'pdx', handicap: 8, wins: 0, losses: 1, draws: 1 },
  { name: 'Darren Kavapalu', team: 'pdx', handicap: 14, wins: 1, losses: 1, draws: 0 },
  { name: 'Brandon Ball', team: 'pdx', handicap: 17, wins: 0, losses: 1, draws: 1 },
  { name: 'Travis Mantych', team: 'pdx', handicap: 11, wins: 1, losses: 1, draws: 0 },
  { name: 'Troy Knight', team: 'pdx', handicap: 16, wins: 1, losses: 0, draws: 1 },
]

// Map full names to short names used in match cards
export const playerShortNames = {
  'Micah Pueschel': 'Micah P.',
  'James Menke': 'James',
  'Todd Howe': 'Todd',
  'John Paik': 'John',
  'Brian Humphrey': 'Brian',
  'Kelso Davis': 'Kelso',
  'Matt Mendoza': 'Matt',
  'Nick DeRosa': 'Nick D.',
  'Rob Donegan': 'Rob D.',
  'Connor McLaughlin': 'Connor',
  'Ali': 'Ali',
  'Jason Jackson': 'Jason',
  'Robby Keilch': 'Robby',
  'Patrick Wolfe': 'Patrick',
  'Aaron Kramer': 'Aaron K.',
  'Micah Brown': 'Micah B.',
  'Scott Owen': 'Scott',
  'Reid Vale': 'Reid',
  'Brandon Lehmann': 'Brandon L.',
  'Joseph Kim': 'Joseph',
  'Luis Lopez': 'Luis',
  'Darren Kavapalu': 'Darren',
  'Brandon Ball': 'Brandon B.',
  'Travis Mantych': 'Travis',
  'Troy Knight': 'Troy',
}

export const leaderboard = [
  { rank: 1, name: 'Micah P.', points: '+2.5', team: 'ca' },
  { rank: 2, name: 'James', points: '+2.0', team: 'ca' },
  { rank: 3, name: 'Patrick', points: '+1.5', team: 'pdx' },
  { rank: 4, name: 'Todd', points: '+1.0', team: 'ca' },
  { rank: 5, name: 'Aaron K.', points: '+0.5', team: 'pdx' },
]

export const feed = [
  { id: 1, author: 'Micah P.', message: 'PDX looking shaky early…', team: 'ca', time: '2m ago' },
  { id: 2, author: 'Patrick', message: "Let's see if CA can hold the lead 😉", team: 'pdx', time: '8m ago' },
  { id: 3, author: 'Kelso', message: '3UP through 10. Feeling dangerous 🔥', team: 'ca', time: '12m ago' },
  { id: 4, author: 'Scott', message: 'All square and grinding. Love this format.', team: 'pdx', time: '18m ago' },
  { id: 5, author: 'John', message: 'Foursomes was brutal but we survived', team: 'ca', time: '25m ago' },
  { id: 6, author: 'Reid', message: 'Brian is cooked. 1DN and fading 📉', team: 'pdx', time: '31m ago' },
  { id: 7, author: 'James', message: 'Aaron K. cannot putt today. Sad to see it.', team: 'ca', time: '40m ago' },
  { id: 8, author: 'Brandon B.', message: 'Connor has no answer for the back nine', team: 'pdx', time: '52m ago' },
]
