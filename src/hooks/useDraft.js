import { useState, useEffect, useCallback } from 'react'
import { doc, onSnapshot, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { players } from '../data/mockData'

const CAPTAINS = { ca: 'Nick DeRosa', pdx: 'Rob Donegan' }
const TOTAL_PICKS = players.length - 2 // 23 draftable players
const DRAFT_DOC = doc(db, 'draft', 'state')

const INITIAL_STATE = {
  status: 'waiting',
  currentPick: 1,
  picks: [],
  caRoster: [CAPTAINS.ca],
  pdxRoster: [CAPTAINS.pdx],
}

// Snake: pick 1 = CA, then pairs: 2-3 PDX, 4-5 CA, 6-7 PDX, ...
export function getSnakeTeam(pickNum) {
  if (pickNum === 1) return 'ca'
  // After pick 1, pairs alternate starting with PDX
  const pairIndex = Math.ceil((pickNum - 1) / 2) // 1-based pair number
  return pairIndex % 2 === 1 ? 'pdx' : 'ca'
}

export function getCaptainForPick(pickNum) {
  const team = getSnakeTeam(pickNum)
  return team === 'ca' ? CAPTAINS.ca : CAPTAINS.pdx
}

export function getDraftPool() {
  return players.filter(p => p.name !== CAPTAINS.ca && p.name !== CAPTAINS.pdx)
}

export function useDraft() {
  const [draft, setDraft] = useState(INITIAL_STATE)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const unsub = onSnapshot(
      DRAFT_DOC,
      (snap) => {
        if (snap.exists()) {
          setDraft(snap.data())
        } else {
          setDraft(INITIAL_STATE)
        }
        setReady(true)
      },
      () => {
        // Fallback to localStorage
        try {
          const stored = localStorage.getItem('rallyDraft')
          if (stored) setDraft(JSON.parse(stored))
        } catch { /* use initial */ }
        setReady(true)
      },
    )
    return unsub
  }, [])

  const saveDraft = useCallback(async (newState) => {
    try {
      await setDoc(DRAFT_DOC, newState)
    } catch {
      localStorage.setItem('rallyDraft', JSON.stringify(newState))
      setDraft(newState)
    }
  }, [])

  const startDraft = useCallback(async () => {
    await saveDraft({ ...INITIAL_STATE, status: 'active' })
  }, [saveDraft])

  const makePick = useCallback(async (playerName) => {
    const team = getSnakeTeam(draft.currentPick)
    const captain = getCaptainForPick(draft.currentPick)
    const newPick = { pick: draft.currentPick, player: playerName, team, captain }
    const isLastPick = draft.currentPick >= TOTAL_PICKS

    const newState = {
      ...draft,
      currentPick: draft.currentPick + 1,
      picks: [...draft.picks, newPick],
      caRoster: team === 'ca' ? [...draft.caRoster, playerName] : draft.caRoster,
      pdxRoster: team === 'pdx' ? [...draft.pdxRoster, playerName] : draft.pdxRoster,
      status: isLastPick ? 'complete' : 'active',
    }

    await saveDraft(newState)

    // Auto-post to feed
    const teamLabel = team === 'ca' ? 'Drifters' : 'Grifters'
    try {
      await addDoc(collection(db, 'feed'), {
        author: 'Draft',
        message: `${captain} selects ${playerName} for ${teamLabel}`,
        team: 'system',
        timestamp: serverTimestamp(),
      })
    } catch { /* feed post is best-effort */ }
  }, [draft, saveDraft])

  const undoPick = useCallback(async () => {
    if (draft.picks.length === 0) return
    const lastPick = draft.picks[draft.picks.length - 1]
    const newState = {
      ...draft,
      currentPick: draft.currentPick - 1,
      picks: draft.picks.slice(0, -1),
      caRoster: lastPick.team === 'ca'
        ? draft.caRoster.filter(n => n !== lastPick.player)
        : draft.caRoster,
      pdxRoster: lastPick.team === 'pdx'
        ? draft.pdxRoster.filter(n => n !== lastPick.player)
        : draft.pdxRoster,
      status: 'active',
    }
    await saveDraft(newState)
  }, [draft, saveDraft])

  const draftedNames = new Set(draft.picks.map(p => p.player))
  const availablePlayers = getDraftPool().filter(p => !draftedNames.has(p.name))
  const currentTeam = draft.status === 'active' ? getSnakeTeam(draft.currentPick) : null
  const currentCaptain = draft.status === 'active' ? getCaptainForPick(draft.currentPick) : null
  const pickRound = Math.ceil(draft.currentPick / 2) || 1
  const isComplete = draft.status === 'complete'

  return {
    draft,
    ready,
    startDraft,
    makePick,
    undoPick,
    availablePlayers,
    currentTeam,
    currentCaptain,
    pickRound,
    isComplete,
    TOTAL_PICKS,
  }
}
