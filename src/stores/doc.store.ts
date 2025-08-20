import type { Editor } from '@tiptap/core'
import type { LookupResponse } from '@/types'
import { create } from 'zustand'
import { lookupWord } from '@/actions/ai/lookup.actions'
import { rewriteWithAi } from '@/actions/ai/rewrite.actions'

interface DocStoreState {
  editorInstance: Editor | null
  setEditorInstance: (editor: Editor | null) => void
  wordCount: number
  setWordCount: (count: number) => void
  characterCount: number
  setCharacterCount: (count: number) => void

  parseDocumentContent: (content: string) => string

  selectionData: {
    from: number
    to: number
    selected: string
    isText: boolean
  }
  setSelectionData: (from: number, to: number, selected: string) => void

  isWaitingResponse: boolean
  currentAction: string
  rewriteResults: { id: string, text: string }[]
  lookupResults: LookupResponse | null
  getRewriteSuggestions: () => void
  getLookupResults: () => void

  saveSignal: boolean
  setSaveSignal: (b: boolean) => void

  showSavedPulse: boolean
  pingSavedPulse: () => void

}

// @ts-ignore
export const useDocStore = create<DocStoreState>((set, get) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return {
    editorInstance: null,
    setEditorInstance: editor => set({ editorInstance: editor }),
    wordCount: 0,
    setWordCount: count => set({ wordCount: count }),
    characterCount: 0,
    setCharacterCount: count => set({ characterCount: count }),

    parseDocumentContent: (content) => {
      if (!content) {
        return { type: 'doc', content: [{ type: 'paragraph' }] }
      }
      try {
        return JSON.parse(content)
      }
      catch {
        return { type: 'doc', content: [{ type: 'paragraph' }] }
      }
    },

    // Selection Data
    selectionData: {
      from: 0,
      to: 0,
      selected: '',
      isText: false,
    },
    setSelectionData: (from, to, selected) => {
      set({ selectionData: {
        from,
        to,
        selected,
        isText: selected.includes(' ') && selected.trim().length > 10,
      } })
    },

    isWaitingResponse: false,
    rewriteResults: [],
    lookupResults: {},
    getRewriteSuggestions: async () => {
      set({ currentAction: 'rewrite' })
      set({ isWaitingResponse: true })
      try {
        const { selectionData } = get()
        const results = await rewriteWithAi(selectionData.selected)
        set({ rewriteResults: results })
        console.log('rewrite results:', results)
      }
      catch (e) {
        console.error('Error rewriting:', e)
        return false
      }
      finally {
        set({ isWaitingResponse: false })
      }
    },
    getLookupResults: async () => {
      set({ currentAction: 'lookup' })
      set({ isWaitingResponse: true })
      try {
        const { selectionData } = get()
        const results = await lookupWord(selectionData.selected)
        set({ lookupResults: results })
      }
      catch (e) {
        console.error('Error looking up:', e)
        return false
      }
      finally {
        set({ isWaitingResponse: false })
      }
    },

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

  }
})
