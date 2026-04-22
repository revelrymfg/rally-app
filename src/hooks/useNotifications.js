import { useEffect, useRef } from 'react'
import { collection, doc, onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'
import { useToast } from '../contexts/ToastContext'
import { playerShortNames } from '../data/mockData'

// Parses a match status into a short toast line
function formatMatchUpdate(m) {
  const names = (m.teamA || []).join('/')
  return `${names} now ${m.status || '-'} thru ${m.thru || '-'}`
}

export function useNotifications(currentUser) {
  const { show } = useToast()
  const myShortName = currentUser
    ? playerShortNames[currentUser.name] || currentUser.name.split(' ')[0]
    : null

  // ── Feed listener ──
  const feedInit = useRef(false)
  const seenFeedIds = useRef(new Set())

  useEffect(() => {
    const q = query(collection(db, 'feed'), orderBy('timestamp', 'desc'), limit(20))
    const unsub = onSnapshot(q, (snap) => {
      if (!feedInit.current) {
        snap.docs.forEach((d) => seenFeedIds.current.add(d.id))
        feedInit.current = true
        return
      }
      for (const d of snap.docs) {
        if (seenFeedIds.current.has(d.id)) continue
        seenFeedIds.current.add(d.id)
        const data = d.data()

        // Skip own posts
        if (data.author === myShortName) continue

        if (data.team === 'system') {
          show({
            type: 'system',
            title: data.author || 'Update',
            message: data.message,
            team: 'system',
          })
        } else {
          show({
            type: 'feed',
            title: data.author,
            message: data.message,
            team: data.team,
          })
        }
      }
    }, () => { /* fallback silently */ })
    return unsub
  }, [myShortName, show])

  // ── Draft pick listener ──
  const draftInit = useRef(false)
  const lastPickCount = useRef(0)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'draft', 'state'), (snap) => {
      if (!snap.exists()) return
      const data = snap.data()
      const picks = data.picks || []
      const count = picks.length

      if (!draftInit.current) {
        lastPickCount.current = count
        draftInit.current = true
        return
      }
      if (count > lastPickCount.current) {
        for (let i = lastPickCount.current; i < count; i++) {
          const pick = picks[i]
          if (!pick) continue
          // Skip if current user is the captain making the pick
          if (pick.captain === currentUser?.name) continue

          const teamLabel = pick.team === 'ca' ? 'CA' : 'PDX'
          const captainFirst = pick.captain.split(' ')[0]
          const playerFirst = pick.player.split(' ')[0]
          show({
            type: 'draft',
            title: 'Draft Pick',
            message: `${captainFirst} selects ${playerFirst} for ${teamLabel}`,
            team: pick.team,
          })
        }
      }
      lastPickCount.current = count
    }, () => { /* fallback silently */ })
    return unsub
  }, [currentUser, show])

  // ── Match updates listener ──
  const matchInit = useRef(false)
  const matchSnapshots = useRef(new Map())

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'matches'), (snap) => {
      if (!matchInit.current) {
        snap.docs.forEach((d) => matchSnapshots.current.set(d.id, d.data()))
        matchInit.current = true
        return
      }

      snap.docChanges().forEach((change) => {
        const data = change.doc.data()
        const id = change.doc.id
        const prev = matchSnapshots.current.get(id)

        // Skip if current user is in the match (their own match — avoid notifying themselves)
        const allPlayers = [...(data.teamA || []), ...(data.teamB || [])]
        if (myShortName && allPlayers.includes(myShortName)) {
          matchSnapshots.current.set(id, data)
          return
        }

        if (change.type === 'added' || change.type === 'modified') {
          // Only fire if status or thru actually changed
          if (prev && prev.status === data.status && prev.thru === data.thru) {
            matchSnapshots.current.set(id, data)
            return
          }
          // Final result
          if (data.thru === 'F' || data.thru === 'FINAL') {
            show({
              type: 'match',
              title: 'Match Final',
              message: formatMatchUpdate(data),
              team: data.leadingTeam || null,
            })
          } else {
            show({
              type: 'score',
              title: 'Match update',
              message: formatMatchUpdate(data),
              team: data.leadingTeam || null,
            })
          }
        }
        matchSnapshots.current.set(id, data)
      })
    }, () => { /* fallback silently */ })
    return unsub
  }, [myShortName, show])
}
