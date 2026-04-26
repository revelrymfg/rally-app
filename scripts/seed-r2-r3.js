#!/usr/bin/env node
/**
 * Rally in the Valley — seed Round 2 and Round 3 pairings into Firestore.
 *
 * Uses the browser-compatible firebase client SDK (no service account needed —
 * project rules allow public writes, same as the app itself writes matches).
 *
 * Match document shape mirrors what src/hooks/useMatches.js writes for R1:
 *   {
 *     roundId, matchNum,
 *     teamA: [full names],
 *     teamB: [full names],
 *     status: '-',
 *     thru: '-',
 *     leadingTeam: null,
 *     published: true,
 *     updatedAt: serverTimestamp(),
 *   }
 *
 * Adds one new field: `teeTime` (string, e.g. "8:10 AM"). Existing code ignores
 * unknown fields so this is additive and safe.
 *
 * Doc IDs: r{roundId}-m{matchNum} — same convention as R1.
 *
 * 2v1 handicap match at 2:10 PM (R3 M12) is stored as a true variable-size
 * pairing: teamA has 2 players, teamB has 1. MatchCard renders this in the
 * stacked "2v2" format (showing "Reid / Joseph" on one line, "Robby" on the
 * other) which conveys the 2v1 correctly. The PairingsManager's canPublish
 * validator would reject this shape (requires teamA.length === teamB.length),
 * but we write published:true directly so admin never needs to re-validate.
 * If Nick ever taps Unpublish on R3, he'll need to re-seed or adjust manually.
 *
 * Run:  node scripts/seed-r2-r3.js
 */

import { initializeApp } from 'firebase/app'
import {
  getFirestore, doc, setDoc, getDoc, serverTimestamp,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBYR3R7aS4dElEMNql_UQDk54d45l1UFxw',
  authDomain: 'rally-in-the-valley-aa44f.firebaseapp.com',
  projectId: 'rally-in-the-valley-aa44f',
  storageBucket: 'rally-in-the-valley-aa44f.firebasestorage.app',
  messagingSenderId: '340435479743',
  appId: '1:340435479743:web:fcbbb510777c8d276faa0a',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// ── Pairings ────────────────────────────────────────────────────────────

const R2_MATCHES = [
  { matchNum: 1, teeTime: '8:10 AM',
    teamA: ['Nick DeRosa', 'Patrick Wolfe'],
    teamB: ['Pasquale DeRosa', 'Connor McLaughlin'] },
  { matchNum: 2, teeTime: '8:20 AM',
    teamA: ['Matt Mendoza', 'Brandon Lehmann'],
    teamB: ['James Menke', 'Travis Mantych'] },
  { matchNum: 3, teeTime: '8:30 AM',
    teamA: ['John Paik', 'Aaron Kramer'],
    teamB: ['Rob Donegan', 'Jason Jackson'] },
  { matchNum: 4, teeTime: '8:40 AM',
    teamA: ['Scott Owen', 'Brandon Ball'],
    teamB: ['Brian Humphrey', 'Todd Howe'] },
  { matchNum: 5, teeTime: '8:50 AM',
    teamA: ['Joseph Kim', 'Micah Brown'],
    teamB: ['Kelso Davis', 'Robby Keilch'] },
  { matchNum: 6, teeTime: '9:00 AM',
    teamA: ['Darren Kavapalu', 'Reid Vale'],
    teamB: ['Troy Knight', 'Micah Pueschel'] },
  { matchNum: 7, teeTime: '9:10 AM',
    teamA: ['Ali'],
    teamB: ['Michael Ventura'] },
]

const R3_MATCHES = [
  { matchNum: 1,  teeTime: '1:10 PM', teamA: ['Brandon Lehmann'],  teamB: ['Connor McLaughlin'] },
  { matchNum: 2,  teeTime: '1:10 PM', teamA: ['Matt Mendoza'],     teamB: ['Travis Mantych'] },
  { matchNum: 3,  teeTime: '1:20 PM', teamA: ['Brandon Ball'],     teamB: ['James Menke'] },
  { matchNum: 4,  teeTime: '1:20 PM', teamA: ['Micah Brown'],      teamB: ['Jason Jackson'] },
  { matchNum: 5,  teeTime: '1:30 PM', teamA: ['John Paik'],        teamB: ['Brian Humphrey'] },
  { matchNum: 6,  teeTime: '1:40 PM', teamA: ['Patrick Wolfe'],    teamB: ['Todd Howe'] },
  { matchNum: 7,  teeTime: '1:40 PM', teamA: ['Nick DeRosa'],      teamB: ['Rob Donegan'] }, // captains
  { matchNum: 8,  teeTime: '1:50 PM', teamA: ['Aaron Kramer'],     teamB: ['Pasquale DeRosa'] },
  { matchNum: 9,  teeTime: '1:50 PM', teamA: ['Darren Kavapalu'],  teamB: ['Kelso Davis'] },
  { matchNum: 10, teeTime: '2:00 PM', teamA: ['Ali'],              teamB: ['Micah Pueschel'] },
  { matchNum: 11, teeTime: '2:00 PM', teamA: ['Scott Owen'],       teamB: ['Troy Knight'] },
  { matchNum: 12, teeTime: '2:10 PM',
    teamA: ['Reid Vale', 'Joseph Kim'], // 2v1 — see header comment
    teamB: ['Robby Keilch'] },
]

function matchId(roundId, matchNum) {
  return `r${roundId}-m${matchNum}`
}

function describe(roundId, m) {
  const teamSize =
    m.teamA.length === m.teamB.length
      ? (m.teamA.length === 1 ? '1v1' : '2v2')
      : `${m.teamA.length}v${m.teamB.length}`
  return `  ${matchId(roundId, m.matchNum).padEnd(6)} ${m.teeTime.padEnd(8)} ` +
    `${teamSize.padEnd(4)} [D] ${m.teamA.join(', ').padEnd(32)} [G] ${m.teamB.join(', ')}`
}

async function main() {
  const allDocs = [
    ...R2_MATCHES.map((m) => ({ roundId: 2, ...m })),
    ...R3_MATCHES.map((m) => ({ roundId: 3, ...m })),
  ]

  console.log('\n=== PREVIEW — will write the following to Firestore ===\n')
  console.log('ROUND 2 — 2-Man Scramble (Fri Apr 24 AM)')
  for (const m of R2_MATCHES) console.log(describe(2, m))
  console.log('\nROUND 3 — Singles Match Play (Fri Apr 24 PM)')
  for (const m of R3_MATCHES) console.log(describe(3, m))

  // Safety check: warn if any R1 doc would be touched (we never write r1-*,
  // but belt and suspenders)
  const touchingR1 = allDocs.some((d) => d.roundId === 1)
  if (touchingR1) {
    console.error('\n✗ Refusing to write — R1 doc in batch. Aborting.')
    process.exit(1)
  }

  // Check if any docs already exist — warn but don't abort (user may be
  // re-running intentionally)
  console.log('\n=== Checking for existing docs ===')
  let existing = 0
  for (const m of allDocs) {
    const id = matchId(m.roundId, m.matchNum)
    const snap = await getDoc(doc(db, 'matches', id))
    if (snap.exists()) {
      existing++
      console.log(`  ${id}: already exists — will be OVERWRITTEN`)
    }
  }
  if (existing > 0) {
    console.log(`  (${existing} existing docs will be overwritten)`)
  } else {
    console.log('  (no conflicts)')
  }

  console.log('\n=== Writing ===\n')
  let written = 0
  for (const m of allDocs) {
    const id = matchId(m.roundId, m.matchNum)
    await setDoc(doc(db, 'matches', id), {
      roundId: m.roundId,
      matchNum: m.matchNum,
      teeTime: m.teeTime,
      teamA: m.teamA,
      teamB: m.teamB,
      status: '-',
      thru: '-',
      leadingTeam: null,
      published: true,
      updatedAt: serverTimestamp(),
    })
    written++
    process.stdout.write(`  ✓ ${id} (${m.teeTime})\n`)
  }

  console.log(`\n=== DONE ===`)
  console.log(`Wrote ${written} match documents.`)
  console.log(`  Round 2: ${R2_MATCHES.length}`)
  console.log(`  Round 3: ${R3_MATCHES.length}`)
  console.log(`  Total:   ${written}\n`)

  // Doc IDs for the user to verify
  console.log('Doc IDs:')
  for (const m of allDocs) {
    console.log(`  ${matchId(m.roundId, m.matchNum)}`)
  }
  console.log('')
  process.exit(0)
}

main().catch((err) => {
  console.error('\n✗ Seed failed:', err)
  process.exit(1)
})
