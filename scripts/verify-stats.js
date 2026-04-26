#!/usr/bin/env node
/**
 * Standalone verification of the player aggregation math.
 *
 * Has its own re-implementation of the aggregation logic — intentionally
 * independent of src/hooks/useTournamentStats.js so we get a real sanity
 * check, not a tautology. If both produce the same numbers, we're confident
 * the math is right.
 *
 * Run:  node scripts/verify-stats.js
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

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

const isFinal = (m) => m.thru === 'F' || m.thru === 'FINAL'
const isHalved = (m) =>
  isFinal(m) && (m.leadingTeam == null || m.status === 'HALVED' || m.status === 'AS')

async function main() {
  const snap = await getDocs(collection(db, 'matches'))
  const matches = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  console.log(`\nLoaded ${matches.length} match docs from Firestore.\n`)

  // Independent aggregation
  const byPlayer = {} // name -> { wins, losses, draws, points, matchesPlayed }
  const byTeam = {
    ca: { points: 0, matchWins: 0, matchLosses: 0, matchHalves: 0 },
    pdx: { points: 0, matchWins: 0, matchLosses: 0, matchHalves: 0 },
  }
  let publishedCount = 0
  let finalizedCount = 0

  function bump(name) {
    if (!byPlayer[name]) {
      byPlayer[name] = { wins: 0, losses: 0, draws: 0, points: 0, matchesPlayed: 0 }
    }
    return byPlayer[name]
  }

  for (const m of matches) {
    if (!m.published) continue
    publishedCount++
    if (!isFinal(m)) continue
    finalizedCount++

    const teamA = (m.teamA || []).filter(Boolean)
    const teamB = (m.teamB || []).filter(Boolean)

    if (isHalved(m)) {
      byTeam.ca.points += 0.5
      byTeam.pdx.points += 0.5
      byTeam.ca.matchHalves += 1
      byTeam.pdx.matchHalves += 1
      for (const n of [...teamA, ...teamB]) {
        const p = bump(n)
        p.draws += 1
        p.points += 0.5
        p.matchesPlayed += 1
      }
    } else if (m.leadingTeam === 'ca') {
      byTeam.ca.points += 1
      byTeam.ca.matchWins += 1
      byTeam.pdx.matchLosses += 1
      for (const n of teamA) {
        const p = bump(n); p.wins += 1; p.points += 1; p.matchesPlayed += 1
      }
      for (const n of teamB) {
        const p = bump(n); p.losses += 1; p.matchesPlayed += 1
      }
    } else if (m.leadingTeam === 'pdx') {
      byTeam.pdx.points += 1
      byTeam.pdx.matchWins += 1
      byTeam.ca.matchLosses += 1
      for (const n of teamB) {
        const p = bump(n); p.wins += 1; p.points += 1; p.matchesPlayed += 1
      }
      for (const n of teamA) {
        const p = bump(n); p.losses += 1; p.matchesPlayed += 1
      }
    }
  }

  console.log(`Published matches:  ${publishedCount}`)
  console.log(`Finalized matches:  ${finalizedCount}`)
  console.log()

  // Spot-check players
  const checks = [
    'Brandon Ball', 'Robby Keilch', 'Joseph Kim',
    'Nick DeRosa', 'Patrick Wolfe', 'Rob Donegan',
    'Micah Pueschel', 'Reid Vale',
  ]
  console.log('SPOT-CHECK PLAYERS')
  console.log('---')
  for (const name of checks) {
    const p = byPlayer[name]
    if (!p) {
      console.log(`  ${name.padEnd(22)} (no entries — never played a published+final match)`)
      continue
    }
    console.log(
      `  ${name.padEnd(22)} ${p.wins}-${p.losses}-${p.draws}` +
      `  ·  ${p.points} pts  ·  ${p.matchesPlayed} played`,
    )
  }
  console.log()

  // Show every match each spot-check player was in (so user can manually
  // cross-reference against Firestore)
  console.log('PER-PLAYER MATCH BREAKDOWN')
  console.log('---')
  for (const name of checks) {
    const playerMatches = matches.filter(
      (m) => m.published && (
        (m.teamA || []).includes(name) || (m.teamB || []).includes(name)
      ),
    )
    if (playerMatches.length === 0) continue
    console.log(`  ${name}:`)
    for (const m of playerMatches) {
      const onA = (m.teamA || []).includes(name)
      const opponents = onA ? (m.teamB || []) : (m.teamA || [])
      const partner = onA
        ? (m.teamA || []).filter((n) => n !== name)
        : (m.teamB || []).filter((n) => n !== name)
      const partnerLabel = partner.length ? ` w/ ${partner.join(', ')}` : ' (solo)'
      const final = isFinal(m)
      const halved = isHalved(m)
      let result = '—'
      if (final) {
        if (halved) result = 'HALVE'
        else if ((m.leadingTeam === 'ca') === onA) result = 'WIN '
        else result = 'LOSS'
      } else {
        result = 'TBD '
      }
      console.log(
        `    ${m.id.padEnd(7)} R${m.roundId} ${result} ${m.status?.padEnd(7) ?? '-      '}` +
        `${partnerLabel} vs ${opponents.join(', ')}`,
      )
    }
  }
  console.log()

  // Team totals
  console.log('TEAM TOTALS')
  console.log('---')
  console.log(`  Drifters:  ${byTeam.ca.points} pts  (${byTeam.ca.matchWins}W ${byTeam.ca.matchLosses}L ${byTeam.ca.matchHalves}H)`)
  console.log(`  Grifters:  ${byTeam.pdx.points} pts  (${byTeam.pdx.matchWins}W ${byTeam.pdx.matchLosses}L ${byTeam.pdx.matchHalves}H)`)
  console.log()

  // Invariants
  const decided = byTeam.ca.matchWins + byTeam.pdx.matchWins
  const halves = byTeam.ca.matchHalves // same on both sides
  const accountedFor = decided + halves
  const teamPointsTotal = byTeam.ca.points + byTeam.pdx.points

  console.log('INVARIANT CHECKS')
  console.log('---')
  const ok = (label, expected, actual) => {
    const pass = expected === actual
    console.log(`  ${pass ? '✓' : '✗'} ${label.padEnd(50)} expected ${expected}, got ${actual}`)
    return pass
  }
  let allPass = true
  allPass &= ok('decided + halved === finalized matches', finalizedCount, accountedFor)
  allPass &= ok('Drifters.points + Grifters.points === finalized', finalizedCount, teamPointsTotal)
  console.log()

  console.log('TARGET (per user spec)')
  console.log('---')
  console.log(`  Drifters: 16 pts (got ${byTeam.ca.points})`)
  console.log(`  Grifters: 8 pts  (got ${byTeam.pdx.points})`)
  console.log()

  process.exit(allPass ? 0 : 1)
}

main().catch((err) => {
  console.error('Verification failed:', err)
  process.exit(1)
})
