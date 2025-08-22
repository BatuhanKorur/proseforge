import type { Editor } from '@tiptap/core'
import type { Document } from '@/generated/prisma'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { CharacterCount } from '@tiptap/extensions'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useMemo } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { SpellCheckExtension } from '@/lib/tiptap-spellcheck'
import { useDocStore } from '@/stores/doc.store'

export function useEditorSetup(doc: Document) {
  const {
    setEditorInstance,
    setSelectionData,
    setCounts,
    runDocumentAnalysis,
  } = useDocStore()

  // Initializes the Tiptap editor with the provided content and extensions.
  const initialContent = useMemo(() => {
    const content = doc?.content as string
    if (!content) {
      return { type: 'doc', content: [{ type: 'paragraph' }] }
    }
    try {
      return JSON.parse(content)
    }
    catch {
      return { type: 'doc', content: [{ type: 'paragraph' }] }
    }
  }, [doc?.content])

  // Debounced selection update for performance.
  const debouncedSelectionUpdate = useDebounce((selection: any, editorInstance: Editor) => {
    if (selection.empty) return
    const selected = editorInstance.state.doc.textBetween(selection.from, selection.to)
    setSelectionData(selection.from, selection.to, selected)
  }, 300)

  // Running document analysis on editor changes, every 0.5s
  const debouncedAnalysis = useDebounce(() => {
    runDocumentAnalysis(true)
  }, 500)

  // # Tiptap Editor Setup
  const editor = useEditor({
    content: initialContent,
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      CharacterCount,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-300',
        },
      }),
      SpellCheckExtension.configure({
        errors: [''],
      }),
    ],
    editorProps: {
      attributes: {
        class: 'doc-edit',
        spellCheck: 'false',
      },
    },
    onCreate: ({ editor }) => {
      setCounts(editor.storage.characterCount)
      runDocumentAnalysis(true)
    },
    onUpdate: ({ editor }) => {
      setCounts(editor.storage.characterCount)
      debouncedAnalysis()
    },
    onSelectionUpdate: ({ editor }) => {
      const selection = editor.state.selection
      debouncedSelectionUpdate(selection, editor)
    },
  })

  useEffect(() => {
    if (editor) {
      setEditorInstance(editor)
    }
  }, [editor, setEditorInstance])

  return editor
}
