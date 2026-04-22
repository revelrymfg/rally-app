import { useDraft } from './useDraft'

/**
 * Resolves the current user's team from the live Firestore draft state.
 * Returns 'ca' | 'pdx' | null.
 *
 * This is the authoritative source of team assignment — don't trust
 * currentUser.team from localStorage since that's set at identity selection
 * and may be stale if the user was drafted after they picked their identity.
 */
export function useUserTeam(currentUser) {
  const { draft } = useDraft()

  if (!currentUser?.name) return null
  if (!draft) return null

  const caRoster = draft.caRoster || []
  const pdxRoster = draft.pdxRoster || []

  if (caRoster.includes(currentUser.name)) return 'ca'
  if (pdxRoster.includes(currentUser.name)) return 'pdx'
  return null
}
