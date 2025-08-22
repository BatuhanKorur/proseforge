import type { Editor } from '@tiptap/core'
import type { CharacterCountStorage } from '@tiptap/extensions'
import type { LookupResponse, ReviewResult } from '@/types'
import { toast } from 'sonner'
import { create } from 'zustand'
import { lookupWord } from '@/actions/ai/lookup.actions'
import { rewriteWithAi } from '@/actions/ai/rewrite.actions'
import { persistDocument } from '@/actions/doc.actions'
import { analyze } from '@/actions/review.actions'
import { extractPreviewText } from '@/lib/utils'
import { useUserStore } from '@/stores/user.store'

interface DocStoreState {
  // Main tiptap editor instance
  editorInstance: Editor | null
  setEditorInstance: (editor: Editor | null) => void

  // Review results (spell check, readability, etc.)
  reviewResults: ReviewResult | null
  setReviewResults: (results: ReviewResult | null) => void
  getReviewData: () => Promise<void>

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

  isAnalysisRunning: boolean
  runDocumentAnalysis: (withPaint: boolean) => void
  paintDocument: () => void
}

// @ts-ignore
export const useDocStore = create<DocStoreState>((set, get) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return {
    // Editor Instance
    editorInstance: null,
    setEditorInstance: editor => set({ editorInstance: editor }),

    // Review results
    reviewResults: null,
    setReviewResults: results => set({ reviewResults: results }),
    getReviewData: async () => {
      const { editorInstance } = get()
      const text = editorInstance?.getText()
      if (!text) {
        return
      }
      try {
        const results = await analyze(text)
        set({ reviewResults: results })
      }
      catch (e) {
        console.error('Error getting review data:', e)
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
        return false
      }

      const json = editorInstance?.getJSON()
      if (!json) {
        toast.error('Error gathering document content')
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
        toast.error('Error occurred while saving document. Please try again.')
        console.error(e)
        return false
      }
    },

    isAnalysisRunning: false,
    runDocumentAnalysis: async (withPaint = false) => {
      const { editorInstance, paintDocument } = get()
      set({ isAnalysisRunning: true })
      if (!editorInstance) {
        return null
      }

      const text = editorInstance?.getText()
      if (!text) {
        return null
      }

      try {
        const results = await analyze(text)
        set({ reviewResults: results })
        if (withPaint) {
          paintDocument()
        }
      }
      catch (e) {
        console.error('Error analyzing document:', e)
      }
      finally {
        set({ isAnalysisRunning: false })
      }
    },

    paintDocument: () => {
      const { reviewResults, editorInstance } = get()
      if (!reviewResults || !editorInstance) {
        return null
      }
      const ignoredWords = useUserStore.getState().ignoredWords
      const ignoredSet = new Set((ignoredWords ?? []).map(w => w.trim().toLowerCase()))
      const filteredSpellcheckWords = reviewResults.spellcheckWords.filter(
        item => !ignoredSet.has(item.trim().toLowerCase()),
      )

      console.log(ignoredWords)
      // @ts-ignore
      editorInstance.commands.setSpellErrors(filteredSpellcheckWords)
    },
  }
})
