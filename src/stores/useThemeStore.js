import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// All app colors come from CSS variables in index.css, so switching themes is
// just adding/removing the `dark` class on <html>.
function applyThemeClass(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

// First visit: follow the operating system preference. Once the user toggles,
// their explicit choice is persisted and always wins over the system setting.
function getInitialTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Global theme store — the single source of truth for light/dark mode.
// Persisted to localStorage like the profile store, so the choice survives
// page refreshes.
export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: getInitialTheme(),
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        applyThemeClass(next)
        set({ theme: next })
      },
    }),
    { name: 'medicare-theme' },
  ),
)

// The store rehydrates synchronously from localStorage when it is created, so
// applying the theme here (at import time, before React renders) keeps the
// class in sync with the store state.
applyThemeClass(useThemeStore.getState().theme)
