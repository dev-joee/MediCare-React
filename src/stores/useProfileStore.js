import { create } from 'zustand'
import { getUserById, updateUser } from '../services/api'

const emptyProfile = { name: '', email: '', phone: '', userId: null }

export const useProfileStore = create((set, get) => ({
  ...emptyProfile,
  loading: false,
  error: null,

  loadProfile: async (userId) => {
    if (get().userId !== userId) set({ ...emptyProfile })

    set({ loading: true, error: null })
    try {
      const user = await getUserById(userId)
      set({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        userId: user.id,
        loading: false,
      })
    } catch {
      set({ loading: false, error: 'network' })
    }
  },

  saveProfile: async (profile) => {
    const { userId } = get()
    if (userId == null) return { error: 'not-authenticated' }

    try {
      const user = await updateUser(userId, {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      })
      set({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        userId: user.id,
      })
      return { user }
    } catch {
      return { error: 'network' }
    }
  },

  clearProfile: () => set({ ...emptyProfile, loading: false, error: null }),
}))

export const selectIsProfileComplete = (state) =>
  Boolean(state.name.trim() && state.email.trim() && state.phone.trim())
