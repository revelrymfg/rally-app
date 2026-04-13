export const awardCategories = ['MVP', 'Sandbagger of the Round', 'Hungover Hero']

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

// All 26 players — captains pre-assigned, rest go to draft pool
// handicap: null = no GHIN on file, ghin: GHIN number or null
export const players = [
  // Captains
  { name: 'Nick DeRosa', team: 'ca', handicap: 17.9, ghin: '11682633', captain: true, wins: 0, losses: 0, draws: 0 },
  { name: 'Rob Donegan', team: 'pdx', handicap: null, ghin: null, captain: true, wins: 0, losses: 0, draws: 0 },

  // Draft pool (24 players — team TBD until draft)
  { name: 'Micah Pueschel', team: null, handicap: 1.7, ghin: '699697', wins: 0, losses: 0, draws: 0 },
  { name: 'James Menke', team: null, handicap: 20.8, ghin: '12055493', wins: 0, losses: 0, draws: 0 },
  { name: 'Todd Howe', team: null, handicap: 4.2, ghin: '10209715', wins: 0, losses: 0, draws: 0 },
  { name: 'John Paik', team: null, handicap: null, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Brian Humphrey', team: null, handicap: 9.9, ghin: '10741518', wins: 0, losses: 0, draws: 0 },
  { name: 'Kelso Davis', team: null, handicap: 10.6, ghin: '11214317', wins: 0, losses: 0, draws: 0 },
  { name: 'Matt Mendoza', team: null, handicap: 21.7, ghin: '12934054', wins: 0, losses: 0, draws: 0 },
  { name: 'Connor McLaughlin', team: null, handicap: null, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Ali', team: null, handicap: 8.4, ghin: '2564735', wins: 0, losses: 0, draws: 0 },
  { name: 'Jason Jackson', team: null, handicap: 15.3, ghin: '10679368', wins: 0, losses: 0, draws: 0 },
  { name: 'Robby Keilch', team: null, handicap: -4.7, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Patrick Wolfe', team: null, handicap: 5.1, ghin: '8724492', wins: 0, losses: 0, draws: 0 },
  { name: 'Aaron Kramer', team: null, handicap: null, ghin: '11275296', wins: 0, losses: 0, draws: 0 },
  { name: 'Micah Brown', team: null, handicap: 10.1, ghin: '2352524', wins: 0, losses: 0, draws: 0 },
  { name: 'Scott Owen', team: null, handicap: null, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Reid Vale', team: null, handicap: 0.7, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Brandon Lehmann', team: null, handicap: 3.3, ghin: '3065904', wins: 0, losses: 0, draws: 0 },
  { name: 'Joseph Kim', team: null, handicap: -2.2, ghin: '10237090', wins: 0, losses: 0, draws: 0 },
  { name: 'Luis Lopez', team: null, handicap: 8.3, ghin: '9355033', wins: 0, losses: 0, draws: 0 },
  { name: 'Darren Kavapalu', team: null, handicap: null, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Brandon Ball', team: null, handicap: null, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Travis Mantych', team: null, handicap: 17.3, ghin: '12438621', wins: 0, losses: 0, draws: 0 },
  { name: 'Troy Knight', team: null, handicap: 6.6, ghin: '11326538', wins: 0, losses: 0, draws: 0 },
  { name: 'Pasquale DeRosa', team: null, handicap: null, ghin: null, wins: 0, losses: 0, draws: 0 },
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
  'Pasquale DeRosa': 'Pasquale',
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
