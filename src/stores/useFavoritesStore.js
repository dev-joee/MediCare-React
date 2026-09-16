import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
