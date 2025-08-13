'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PrefState {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export const usePrefStore = create<PrefState>()(persist(
  set => ({
    sidebarOpen: true,
    toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  }),
  {
    name: 'pref',
    version: 1,
  },
))
