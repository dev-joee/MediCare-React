import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Global favorite doctors store.
// Only doctor IDs are kept (never full doctor objects), so the list stays
// small and never goes stale when doctor data changes on the server.
// Persisted to localStorage, same pattern as useProfileStore.
export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (doctorId) =>
        set((state) => ({
          favorites: state.favorites.includes(doctorId)
            ? state.favorites.filter((id) => id !== doctorId)
            : [...state.favorites, doctorId],
        })),
      isFavorite: (doctorId) => get().favorites.includes(doctorId),
    }),
    { name: 'medicare-favorite-doctors' },
  ),
)
