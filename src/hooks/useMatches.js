import { useState, useEffect, useCallback } from 'react'
import { collection, doc, onSnapshot, setDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { db } from '../firebase'

export const ROUND_INFO = [
  { id: 1, name: 'Round 1 — 2-Man Best Ball', format: 'best-ball', teamSize: 2 },
  { id: 2, name: 'Round 2 — 2-Man Scramble', format: 'scramble', teamSize: 2 },
  { id: 3, name: 'Round 3 — Singles Match Play', format: 'singles', teamSize: 1 },
]

export function getRoundInfo(roundId) {
  return ROUND_INFO.find((r) => r.id === roundId)
}

// Deterministic match ID so edits replace rather than create duplicates
export function matchId(roundId, matchNum) {
  return `r${roundId}-m${matchNum}`
}

export function useMatches() {
  const [matches, setMatches] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'matches'),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        // Sort by roundId, then matchNum
        docs.sort((a, b) => (a.roundId - b.roundId) || (a.matchNum - b.matchNum))
        setMatches(docs)
        setReady(true)
      },
      () => setReady(true),
    )
    return unsub
  }, [])

  // Save a single match (draft or published)
  const saveMatch = useCallback(async (match) => {
    const id = matchId(match.roundId, match.matchNum)
    await setDoc(doc(db, 'matches', id), {
      roundId: match.roundId,
      matchNum: match.matchNum,
      teamA: match.teamA || [],
      teamB: match.teamB || [],
      status: match.status || '-',
      thru: match.thru ?? '-',
      leadingTeam: match.leadingTeam ?? null,
      published: match.published ?? false,
      // Persist hole-by-hole results. ScoreEntry sends the full updated map
      // on every save, so a whole-object overwrite is correct. Without this
      // field the holes map was silently dropped on every save.
      holes: match.holes || {},
      updatedAt: serverTimestamp(),
    })
  }, [])

  // Delete a match
  const deleteMatch = useCallback(async (roundId, matchNum) => {
    await deleteDoc(doc(db, 'matches', matchId(roundId, matchNum)))
  }, [])

  // Publish/unpublish all matches in a round
  const setRoundPublished = useCallback(async (roundId, published) => {
    const batch = writeBatch(db)
    const roundMatches = matches.filter((m) => m.roundId === roundId)
    for (const m of roundMatches) {
      batch.update(doc(db, 'matches', m.id), { published })
    }
    await batch.commit()
  }, [matches])

  // Helpers
  const matchesByRound = (roundId) =>
    matches.filter((m) => m.roundId === roundId).sort((a, b) => a.matchNum - b.matchNum)

  const publishedMatchesByRound = (roundId) =>
    matchesByRound(roundId).filter((m) => m.published)

  // Find the user's match (by short name) across all published matches
  const findUserMatch = (shortName, roundId = null) => {
    const pool = roundId !== null ? publishedMatchesByRound(roundId) : matches.filter((m) => m.published)
    return pool.find((m) => (m.teamA || []).includes(shortName) || (m.teamB || []).includes(shortName))
  }

  return {
    matches,
    ready,
    matchesByRound,
    publishedMatchesByRound,
    findUserMatch,
    saveMatch,
    deleteMatch,
    setRoundPublished,
  }
}
