import { create } from 'zustand'
import { rewriteWithAi } from '@/actions/ai/rewrite.actions'
import { lookupWord } from '@/actions/ai/word.actions'

interface DocStoreState {
  saveSignal: boolean
  setSaveSignal: (b: boolean) => void

  showSavedPulse: boolean
  pingSavedPulse: () => void

  isRewriting: boolean
  rewriteResults: string[]
  triggerRewrite: (text: string) => void

  isLookingUp: boolean
  lookupResults: any
  triggerLookup: (word: string) => void
}

export const useDocStore = create<DocStoreState>((set) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return {
    // Save Signal
    saveSignal: false,
    setSaveSignal: (value) => {
      set({ saveSignal: value })
    },

    // Save Pulse
    showSavedPulse: false,
    pingSavedPulse: () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      set({ showSavedPulse: true })
      timeoutId = setTimeout(() => {
        set({ showSavedPulse: false })
      }, 2500)
    },

    // Rewrite with AI
    isRewriting: false,
    rewriteResults: [],
    triggerRewrite: async (text) => {
      set({ isRewriting: true })
      try {
        const results = await rewriteWithAi(text)
        set({ rewriteResults: results })
      }
      catch (e) {
        console.error('Error rewriting:', e)
        return false
      }
      finally {
        set({ isRewriting: false })
      }
    },

    isLookingUp: false,
    lookupResults: {},
    triggerLookup: async (word) => {
      set({ isLookingUp: true })
      try {
        // Call your API here
        const results = await lookupWord(word)
        set({ lookupResults: results })
        console.log(results)
        // Display results in the UI
        // ...
      }
      catch (e) {
        console.error('Error looking up:', e)
        return false
      }
      finally {
        set({ isLookingUp: false })
      }
    },
  }
})
