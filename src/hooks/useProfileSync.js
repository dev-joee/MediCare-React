import { useEffect } from 'react'
import { useAuthStore } from '../stores/useAuthStore'
import { useProfileStore } from '../stores/useProfileStore'

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
