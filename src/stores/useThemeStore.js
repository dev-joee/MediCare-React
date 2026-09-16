import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function applyThemeClass(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

function getInitialTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

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

applyThemeClass(useThemeStore.getState().theme)
