import { useEffect } from 'react'
import { useAuthStore } from '../stores/useAuthStore'
import { useProfileStore } from '../stores/useProfileStore'

// Keeps the in-memory profile cache in step with whoever is logged in.
//
// One effect covers every case, because all of them are "the authenticated user
// changed":
//   login        -> userId appears   -> fetch that user's profile
//   page refresh -> userId restored  -> fetch that user's profile
//   user switch  -> userId changes   -> fetch the new user's profile
//   logout       -> userId becomes null -> clear, so the previous user's
//                   details cannot linger in the UI
//
// Called from Layout, so it runs on every route (the Navbar needs the profile
// completion state on public pages too, not just on /profile).
export function useProfileSync() {
  const userId = useAuthStore((state) => state.user?.id ?? null)
  const loadProfile = useProfileStore((state) => state.loadProfile)
  const clearProfile = useProfileStore((state) => state.clearProfile)

  useEffect(() => {
    if (userId == null) {
      clearProfile()
      return
    }
    loadProfile(userId)
  }, [userId, loadProfile, clearProfile])
}
