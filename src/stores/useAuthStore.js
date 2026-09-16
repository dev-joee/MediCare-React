import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createUser, findUserByEmail } from '../services/api'
import { useProfileStore } from './useProfileStore'

// Mock authentication for this local training project.
//
// Accounts live in the `users` collection of db.json and are read/written
// through the existing json-server API (src/services/api.js). Passwords are
// stored and compared as plaintext — this is fine for a local demo and is NOT
// production-safe. A real app would delegate to a proper auth provider.
//
// Authentication state only — "who is logged in". Deliberately separate from
// useProfileStore, which holds the user's extra application data (contact
// details). Logging out does not clear the profile, and saving a profile does
// not log anyone in.

// Lower-cased so "Demo@x.com" and "demo@x.com" are the same account.
const normalizeEmail = (email) => email.trim().toLowerCase()

// The account record also holds the password; the logged-in user must not.
const toSessionUser = (account) => ({
  id: account.id,
  name: account.name,
  email: account.email,
})

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,

      // Returns { user } on success or { error } to show on the form.
      signup: async ({ name, email, password }) => {
        const cleanEmail = normalizeEmail(email)

        try {
          const existing = await findUserByEmail(cleanEmail)
          if (existing.length > 0) {
            return { error: 'An account with this email already exists.' }
          }

          const account = await createUser({
            name: name.trim(),
            email: cleanEmail,
            password,
            // Profile fields live on the user's own record; the name from
            // signup seeds the profile, the rest starts empty.
            phone: '',
          })

          set({ user: toSessionUser(account) })
          return { user: toSessionUser(account) }
        } catch {
          return { error: 'Could not create your account. Please try again.' }
        }
      },

      // Returns { user } on success or { error } to show on the form.
      login: async ({ email, password }) => {
        try {
          const [account] = await findUserByEmail(normalizeEmail(email))

          // Same message for "no such email" and "wrong password" so the form
          // does not reveal which accounts exist.
          if (!account || account.password !== password) {
            return { error: 'Invalid email or password.' }
          }

          set({ user: toSessionUser(account) })
          return { user: toSessionUser(account) }
        } catch {
          return { error: 'Could not log you in. Please try again.' }
        }
      },

      // Clears the session AND the cached profile, so the next user to log in
      // can never see the previous user's details.
      logout: () => {
        useProfileStore.getState().clearProfile()
        set({ user: null })
      },
    }),
    {
      name: 'medicare-auth-user',
      // Persist the identity only — never the password.
      partialize: (state) => ({ user: state.user }),
    },
  ),
)

// Single source of truth for "is someone logged in?" — used by the route guard
// and the Navbar so both always agree.
export const selectIsAuthenticated = (state) => Boolean(state.user)
