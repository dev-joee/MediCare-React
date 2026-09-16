import { create } from 'zustand'
import { getUserById, updateUser } from '../services/api'

// Cache of the CURRENTLY AUTHENTICATED user's profile.
//
// json-server is the source of truth: the profile fields live on the user's own
// record in the `users` collection of db.json. This store only mirrors that
// record in memory for the UI — nothing is written to localStorage, so one
// user's details can never leak into another user's session. The cache is
// reloaded (or cleared) whenever the logged-in user changes; see
// src/hooks/useProfileSync.js.
//
// The shape is kept flat (name / email / phone at the top level) so the
// existing consumers — the Navbar dot, the booking-form pre-fill and
// selectIsProfileComplete — keep working unchanged.
const emptyProfile = { name: '', email: '', phone: '', userId: null }

export const useProfileStore = create((set, get) => ({
  ...emptyProfile,
  loading: false,
  error: null,

  // GET /users/:id — loads that user's profile from json-server.
  loadProfile: async (userId) => {
    // Drop any cached profile belonging to a different user before fetching, so
    // one user's details are never on screen while another's are loading.
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

  // PATCH /users/:id — persists first, then updates the cache, so the UI never
  // shows a change json-server did not accept.
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

  // Dropped on logout so the next user never sees the previous one's details.
  clearProfile: () => set({ ...emptyProfile, loading: false, error: null }),
}))

// Derived selector — the single source of truth for "has the current user
// filled in their profile?". A profile counts as complete once all contact
// fields are saved. Shared by the Profile page (info view vs. empty state) and
// the Navbar (red notification dot) so both always agree.
export const selectIsProfileComplete = (state) =>
  Boolean(state.name.trim() && state.email.trim() && state.phone.trim())
