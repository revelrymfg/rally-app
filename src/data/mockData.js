export const awardCategories = ['MVP', 'Sandbagger of the Round', 'Hungover Hero']

export const eventData = {
  title: 'RALLY IN THE VALLEY',
  day: 1,
  session: 'Pre-Tournament',
}

export const scores = {
  ca: 0,
  pdx: 0,
}

// Current live matches (shown on Home) — empty until tournament starts
export const matches = []

// All rounds — structure ready, no results yet
export const rounds = [
  {
    id: 1,
    name: 'Round 1 — 2-Man Best Ball',
    status: 'upcoming',
    matches: [],
  },
  {
    id: 2,
    name: 'Round 2 — 2-Man Scramble',
    status: 'upcoming',
    matches: [],
  },
  {
    id: 3,
    name: 'Round 3 — Singles Match Play',
    status: 'upcoming',
    matches: [],
  },
]

// All 26 players — captains pre-assigned, rest go to draft pool
// handicap: null = no GHIN on file, ghin: GHIN number or null
export const players = [
  // Captains
  { name: 'Nick DeRosa', team: 'ca', handicap: 17.9, ghin: '11682633', captain: true, wins: 0, losses: 0, draws: 0 },
  { name: 'Rob Donegan', team: 'pdx', handicap: 19.1, ghin: null, captain: true, wins: 0, losses: 0, draws: 0 },

  // Draft pool (24 players — team TBD until draft)
  { name: 'Micah Pueschel', team: null, handicap: 1.7, ghin: '699697', wins: 0, losses: 0, draws: 0 },
  { name: 'James Menke', team: null, handicap: 20.8, ghin: '12055493', wins: 0, losses: 0, draws: 0 },
  { name: 'Todd Howe', team: null, handicap: 3.8, ghin: '10209715', wins: 0, losses: 0, draws: 0 },
  { name: 'John Paik', team: null, handicap: 14.0, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Brian Humphrey', team: null, handicap: 9.9, ghin: '10741518', wins: 0, losses: 0, draws: 0 },
  { name: 'Kelso Davis', team: null, handicap: 10.6, ghin: '11214317', wins: 0, losses: 0, draws: 0 },
  { name: 'Matt Mendoza', team: null, handicap: 21.7, ghin: '12934054', wins: 0, losses: 0, draws: 0 },
  { name: 'Connor McLaughlin', team: null, handicap: 3.0, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Ali', team: null, handicap: 8.6, ghin: '2564735', wins: 0, losses: 0, draws: 0 },
  { name: 'Jason Jackson', team: null, handicap: 15.3, ghin: '10679368', wins: 0, losses: 0, draws: 0 },
  { name: 'Robby Keilch', team: null, handicap: -4.7, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Patrick Wolfe', team: null, handicap: 5.1, ghin: '8724492', wins: 0, losses: 0, draws: 0 },
  { name: 'Aaron Kramer', team: null, handicap: 19.5, ghin: '11275296', wins: 0, losses: 0, draws: 0 },
  { name: 'Micah Brown', team: null, handicap: 10.1, ghin: '2352524', wins: 0, losses: 0, draws: 0 },
  { name: 'Scott Owen', team: null, handicap: 2.4, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Reid Vale', team: null, handicap: 0.8, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Brandon Lehmann', team: null, handicap: 3.3, ghin: '3065904', wins: 0, losses: 0, draws: 0 },
  { name: 'Joseph Kim', team: null, handicap: -2.0, ghin: '10237090', wins: 0, losses: 0, draws: 0 },
  { name: 'Darren Kavapalu', team: null, handicap: 8.6, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Brandon Ball', team: null, handicap: 11.0, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Travis Mantych', team: null, handicap: 16.9, ghin: '12438621', wins: 0, losses: 0, draws: 0 },
  { name: 'Troy Knight', team: null, handicap: 6.6, ghin: '11326538', wins: 0, losses: 0, draws: 0 },
  { name: 'Pasquale DeRosa', team: null, handicap: 10.0, ghin: null, wins: 0, losses: 0, draws: 0 },
  { name: 'Michael Ventura', team: null, handicap: 8.0, ghin: null, wins: 0, losses: 0, draws: 0 },
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
  'Darren Kavapalu': 'Darren',
  'Brandon Ball': 'Brandon B.',
  'Travis Mantych': 'Travis',
  'Troy Knight': 'Troy',
  'Pasquale DeRosa': 'Pasquale',
  'Michael Ventura': 'Michael V.',
}

// Leaderboard — empty until matches are played
export const leaderboard = []

// Seed feed — empty, real posts come from Firestore
export const feed = []
