'use client'

import type { FavoriteItem } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserStoreState {
  favorites: FavoriteItem[]
  setFavorite: (id: string, title: string) => void
  removeFavorite: (id: string) => void
}

export const useUserStore = create<UserStoreState>()(persist(
  set => ({
    // Favorite
    favorites: [],
    setFavorite: (id, title) =>
      set((state) => {
        const exists = state.favorites.some(f => f.id === id)
        if (exists) {
          // remove (toggle off)
          return {
            favorites: state.favorites.filter(f => f.id !== id),
          }
        }
        // add (toggle on)
        return {
          favorites: [{ id, title }, ...state.favorites],
        }
      }),
    removeFavorite: id =>
      set(state => ({
        favorites: state.favorites.filter(f => f.id !== id),
      })),
  }),
  {
    name: 'user',
    version: 1,
  },
))
