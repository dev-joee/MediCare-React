import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createUser, findUserByEmail } from '../services/api'
import { useProfileStore } from './useProfileStore'

const normalizeEmail = (email) => email.trim().toLowerCase()

const toSessionUser = (account) => ({
  id: account.id,
  name: account.name,
  email: account.email,
})

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,

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
            phone: '',
          })

          set({ user: toSessionUser(account) })
          return { user: toSessionUser(account) }
        } catch {
          return { error: 'Could not create your account. Please try again.' }
        }
      },

      login: async ({ email, password }) => {
        try {
          const [account] = await findUserByEmail(normalizeEmail(email))

          if (!account || account.password !== password) {
            return { error: 'Invalid email or password.' }
          }

          set({ user: toSessionUser(account) })
          return { user: toSessionUser(account) }
        } catch {
          return { error: 'Could not log you in. Please try again.' }
        }
      },

      logout: () => {
        useProfileStore.getState().clearProfile()
        set({ user: null })
      },
    }),
    {
      name: 'medicare-auth-user',
      partialize: (state) => ({ user: state.user }),
    },
  ),
)

export const selectIsAuthenticated = (state) => Boolean(state.user)
