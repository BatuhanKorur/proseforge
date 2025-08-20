import type { Editor } from '@tiptap/core'
import type { CharacterCountStorage } from '@tiptap/extensions'
import type { LookupResponse } from '@/types'
import { create } from 'zustand'
import { lookupWord } from '@/actions/ai/lookup.actions'
import { rewriteWithAi } from '@/actions/ai/rewrite.actions'
import { persistDocument } from '@/actions/doc.actions'
import { extractPreviewText } from '@/lib/utils'

interface DocStoreState {
  // Main tiptap editor instance
  editorInstance: Editor | null
  setEditorInstance: (editor: Editor | null) => void
  parseDocumentContent: (content: string) => string

  // Counts
  wordCount: number
  characterCount: number
  setCounts: (characterCount: CharacterCountStorage) => void

  // Selection Data (What part of the document is currently selected)
  selectionData: {
    from: number
    to: number
    selected: string
    isText: boolean
  }
  setSelectionData: (from: number, to: number, selected: string) => void

  // Lookup and Rewrite State
  isWaitingResponse: boolean
  currentAction: string
  rewriteResults: { id: string, text: string }[]
  lookupResults: LookupResponse | null
  getRewriteSuggestions: () => void
  getLookupResults: () => void

  // Save Document?
  saveDocument: (docId: string) => Promise<boolean>
  isSaved: boolean
}

// @ts-ignore
export const useDocStore = create<DocStoreState>((set, get) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return {
    // Editor Instance
    editorInstance: null,
    setEditorInstance: editor => set({ editorInstance: editor }),
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

    // Counts
    wordCount: 0,
    characterCount: 0,
    setCounts: (characterCount: CharacterCountStorage) => set({
      wordCount: characterCount.words(),
      characterCount: characterCount.characters(),
    }),

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

    isSaving: false,
    saveDocument: async (docId: string) => {
      const { editorInstance } = get()
      if (!editorInstance) {
        console.error('No editor instance to save document with')
        return false
      }

      const json = editorInstance?.getJSON()
      if (!json) {
        console.error('No content to save')
        return false
      }

      try {
        const previewText = extractPreviewText(editorInstance)
        await persistDocument(docId, JSON.stringify(json), previewText)
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        set({ isSaved: true })
        timeoutId = setTimeout(() => {
          set({ isSaved: false })
        }, 2500)
      }
      catch (e) {
        console.error('Error extracting preview text:', e)
      }
    },
  }
})
