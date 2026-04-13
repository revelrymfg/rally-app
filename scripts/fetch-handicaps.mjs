#!/usr/bin/env node

/**
 * GHIN Handicap Lookup Script
 *
 * The GHIN API requires authenticated access (no public endpoint).
 * This script attempts the known API endpoints, and if they fail,
 * outputs a template for manual entry.
 *
 * Usage: node scripts/fetch-handicaps.mjs
 *
 * If you have a valid GHIN token, set it as an environment variable:
 *   GHIN_TOKEN=your_token node scripts/fetch-handicaps.mjs
 */

const players = [
  { name: 'Micah Pueschel', ghin: '699697' },
  { name: 'James Menke', ghin: '12055493' },
  { name: 'Todd Howe', ghin: '10209715' },
  { name: 'Brian Humphrey', ghin: '10741518' },
  { name: 'Kelso Davis', ghin: '11214317' },
  { name: 'Matt Mendoza', ghin: '12934054' },
  { name: 'Nick DeRosa', ghin: '11682633' },
  { name: 'Ali', ghin: '2564735' },
  { name: 'Jason Jackson', ghin: '10679368' },
  { name: 'Patrick Wolfe', ghin: '8724492' },
  { name: 'Aaron Kramer', ghin: '11275296' },
  { name: 'Micah Brown', ghin: '2352524' },
  { name: 'Brandon Lehmann', ghin: '3065904' },
  { name: 'Joseph Kim', ghin: '10237090' },
  { name: 'Luis Lopez', ghin: '9355033' },
  { name: 'Travis Mantych', ghin: '12438621' },
  { name: 'Troy Knight', ghin: '11326538' },
]

const GHIN_TOKEN = process.env.GHIN_TOKEN || 'canIGetAHandicap'

async function fetchHandicap(ghinNumber) {
  // Try Bearer token auth first, fall back to query param
  const url = `https://api2.ghin.com/api/v1/golfers/search.json?per_page=1&page=1&golfer_id=${ghinNumber}`

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GHIN_TOKEN}`,
        'Accept': 'application/json',
      },
    })
    const data = await res.json()

    if (data.error) {
      return { error: data.error }
    }

    if (data.golfers && data.golfers.length > 0) {
      const golfer = data.golfers[0]
      return {
        name: `${golfer.first_name} ${golfer.last_name}`,
        handicap_index: golfer.handicap_index,
        club: golfer.club_name,
      }
    }

    return { error: 'No golfer found' }
  } catch (err) {
    return { error: err.message }
  }
}

async function main() {
  console.log('GHIN Handicap Lookup')
  console.log('====================\n')

  const results = {}
  let apiWorking = false

  // Test first player to see if API works
  console.log('Testing GHIN API...')
  const test = await fetchHandicap(players[0].ghin)

  if (test.error) {
    console.log(`API returned: ${test.error}`)
    console.log('\nThe GHIN API requires a valid auth token.')
    console.log('Set GHIN_TOKEN environment variable if you have one.\n')
    console.log('Manual entry template — fill in handicaps and update mockData.js:\n')

    console.log(JSON.stringify(
      Object.fromEntries(players.map(p => [p.name, { ghin: p.ghin, handicap: null }])),
      null, 2
    ))

    console.log('\n\nTo look up handicaps manually:')
    console.log('1. Open the GHIN app on your phone')
    console.log('2. Search each GHIN number')
    console.log('3. Record the Handicap Index')
    console.log('\nOr ask each player to text you their current index.')
    return
  }

  apiWorking = true
  console.log('API is working! Fetching all handicaps...\n')

  for (const player of players) {
    const result = await fetchHandicap(player.ghin)
    if (result.handicap_index !== undefined) {
      results[player.name] = {
        ghin: player.ghin,
        handicap: result.handicap_index,
        club: result.club,
      }
      console.log(`✓ ${player.name}: ${result.handicap_index} (${result.club})`)
    } else {
      results[player.name] = { ghin: player.ghin, handicap: null, error: result.error }
      console.log(`✗ ${player.name}: ${result.error}`)
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 300))
  }

  console.log('\n\nResults JSON:')
  console.log(JSON.stringify(results, null, 2))
}

main()
