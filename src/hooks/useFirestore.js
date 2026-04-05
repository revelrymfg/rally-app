import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { feed as seedFeed } from '../data/mockData'

// ── Feed ──────────────────────────────────────────
export function useFeed() {
  const [posts, setPosts] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const q = query(collection(db, 'feed'), orderBy('timestamp', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          time: formatTime(d.data().timestamp?.toDate()),
        }))
        setPosts(docs.length > 0 ? docs : seedFeed)
        setReady(true)
      },
      () => {
        // Firestore error — fall back to seed data
        setPosts(seedFeed)
        setReady(true)
      },
    )
    return unsub
  }, [])

  const addPost = useCallback(async (author, message, team) => {
    try {
      await addDoc(collection(db, 'feed'), {
        author,
        message,
        team,
        timestamp: serverTimestamp(),
      })
    } catch {
      // Offline fallback — add locally
      setPosts((prev) => [
        { id: Date.now(), author, message, team, time: 'just now' },
        ...prev,
      ])
    }
  }, [])

  return { posts, addPost, ready }
}

// ── Votes ─────────────────────────────────────────
export function useVotes(roundId) {
  const [allVotes, setAllVotes] = useState([])

  useEffect(() => {
    if (!roundId) return
    const q = query(collection(db, 'votes'), where('roundId', '==', roundId))
    const unsub = onSnapshot(
      q,
      (snap) => setAllVotes(snap.docs.map((d) => d.data())),
      () => setAllVotes([]),
    )
    return unsub
  }, [roundId])

  // Compute tallies from all vote docs
  const tallies = {}
  for (const v of allVotes) {
    if (!tallies[v.category]) tallies[v.category] = {}
    tallies[v.category][v.nominee] = (tallies[v.category][v.nominee] || 0) + 1
  }

  // Get current user's votes
  function getMyVotes(voterName) {
    const mine = {}
    for (const v of allVotes) {
      if (v.voterName === voterName) mine[v.category] = v.nominee
    }
    return mine
  }

  const castVote = useCallback(
    async (category, voterName, nominee) => {
      const docId = `${roundId}_${category}_${voterName}`
      try {
        await setDoc(doc(db, 'votes', docId), {
          roundId,
          category,
          voterName,
          nominee,
          timestamp: serverTimestamp(),
        })
      } catch {
        // Offline — update local state
        setAllVotes((prev) => {
          const filtered = prev.filter(
            (v) => !(v.roundId === roundId && v.category === category && v.voterName === voterName),
          )
          return [...filtered, { roundId, category, voterName, nominee }]
        })
      }
    },
    [roundId],
  )

  return { tallies, getMyVotes, castVote, allVotes }
}

// ── Awards Closed ─────────────────────────────────
export function useAwardsClosed(roundId) {
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    if (!roundId) return
    const unsub = onSnapshot(
      doc(db, 'awardsClosed', String(roundId)),
      (snap) => setClosed(snap.exists() && snap.data()?.closed === true),
      () => {
        // Fallback to localStorage
        setClosed(localStorage.getItem(`rallyAwardsClosed_${roundId}`) === 'true')
      },
    )
    return unsub
  }, [roundId])

  const closeVoting = useCallback(async () => {
    try {
      await setDoc(doc(db, 'awardsClosed', String(roundId)), {
        closed: true,
        timestamp: serverTimestamp(),
      })
    } catch {
      localStorage.setItem(`rallyAwardsClosed_${roundId}`, 'true')
      setClosed(true)
    }
  }, [roundId])

  return { closed, closeVoting }
}

// ── Side Games ────────────────────────────────────
export function useSideGames() {
  const [games, setGames] = useState({})

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'sideGames'),
      (snap) => {
        const data = {}
        snap.docs.forEach((d) => {
          data[d.id] = d.data()
        })
        setGames(data)
      },
      () => {
        // Fallback to localStorage
        try {
          setGames(JSON.parse(localStorage.getItem('rallySideGames')) || {})
        } catch { setGames({}) }
      },
    )
    return unsub
  }, [])

  const saveGame = useCallback(async (key, entry) => {
    try {
      await setDoc(doc(db, 'sideGames', key), {
        ...entry,
        timestamp: serverTimestamp(),
      })
    } catch {
      // Offline fallback
      setGames((prev) => {
        const next = { ...prev, [key]: entry }
        localStorage.setItem('rallySideGames', JSON.stringify(next))
        return next
      })
    }
  }, [])

  return { games, saveGame }
}

// ── Helpers ───────────────────────────────────────
function formatTime(date) {
  if (!date) return 'just now'
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
