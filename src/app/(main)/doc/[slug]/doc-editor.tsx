'use client'
import type { Document } from '@/generated/prisma'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { CharacterCount } from '@tiptap/extensions'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import DocBubble from '@/app/(main)/doc/[slug]/doc-bubble'
import DocToolbar from '@/app/(main)/doc/[slug]/doc-toolbar'
import { useShortcut } from '@/hooks/use-keyboard'
import { SpellCheckExtension } from '@/lib/tiptap-spellcheck'
import { useDocStore } from '@/stores/doc.store'

export default function DocEditor({ doc }: {
  doc: Document
}) {
  const {
    parseDocumentContent,
    setEditorInstance,
    setSelectionData,
    setCounts,
    saveDocument,
    runDocumentAnalysis,
    paintDocument,
  } = useDocStore()

  // Setup initial content from the document
  const initialContent = useMemo(() => {
    return parseDocumentContent(doc?.content as string)
  }, [doc?.content, parseDocumentContent])

  // Selection Data Update
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const debouncedSelectionUpdate = useCallback((selection: any, editorInstance: any) => {
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current)
    }

    // Set new timeout
    selectionTimeoutRef.current = setTimeout(() => {
      if (selection.empty) {
        return
      }
      const selected = editorInstance.state.doc.textBetween(selection.from, selection.to)
      setSelectionData(selection.from, selection.to, selected)
    }, 300)
  }, [setSelectionData])

  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scheduleAnalysis = useCallback(() => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current)
    }

    analysisTimeoutRef.current = setTimeout(() => {
      runDocumentAnalysis(true)
    }, 500)
  }, [runDocumentAnalysis])

  useEffect(() => {
    return () => {
      if (analysisTimeoutRef.current)
        clearTimeout(analysisTimeoutRef.current)
      if (selectionTimeoutRef.current)
        clearTimeout(selectionTimeoutRef.current)
    }
  }, [])

  // Setup the editor instance
  const editor = useEditor({
    extensions: [
      StarterKit,
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
    content: initialContent,
    immediatelyRender: false,
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
      scheduleAnalysis()
    },
    onSelectionUpdate: ({ editor }) => {
      const selection = editor.state.selection
      debouncedSelectionUpdate(selection, editor)
    },
  })

  // Settings editor instance on store
  useEffect(() => {
    if (editor) {
      setEditorInstance(editor)
    }
  }, [editor, setEditorInstance])

  useShortcut('ctrl+s', () => saveDocument(doc.id))

  const handleContentAreaClick = useCallback(() => {
    editor?.commands.focus()
  }, [editor])

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <DocToolbar />
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain pt-8"
        onClick={handleContentAreaClick}
      >
        <div className="mx-auto w-full max-w-3xl">
          { editor && <DocBubble />}
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}
