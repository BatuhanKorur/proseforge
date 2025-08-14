'use client'
import type { Document } from '@/generated/prisma'
import { CharacterCount } from '@tiptap/extensions'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { persistDocument } from '@/actions/doc.actions'
import DocBubble from '@/app/(main)/doc/[slug]/doc-bubble'
import DocFooter from '@/app/(main)/doc/[slug]/doc-footer'
import DocToolbar from '@/app/(main)/doc/[slug]/doc-toolbar'
import { useShortcut } from '@/hooks/use-keyboard'
import { extractPreviewText } from '@/lib/utils'
import { useDocStore } from '@/stores/doc.store'

export default function DocView({ doc }: {
  doc: Document
}) {
  const {
    saveSignal,
    parseDocumentContent,
    setSaveSignal,
    pingSavedPulse,
    setEditorInstance,
    setSelectionData,
    setCharacterCount,
    setWordCount,
  } = useDocStore()

  // Setup initial content from the document
  const initialContent = useMemo(() => {
    return parseDocumentContent(doc?.content as string)
  }, [doc?.content, parseDocumentContent])

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
    }, 300) // 0.3 second delay
  }, [setSelectionData])

  // Setup the editor instance
  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount,
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'doc-edit',
      },
    },
    onUpdate: ({ editor }) => {
      setCharacterCount(editor.storage.characterCount.characters())
      setWordCount(editor.storage.characterCount.words())
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

  // Save the current document when necessary
  const saveCurrentDoc = useCallback(async () => {
    const json = editor?.getJSON()
    if (!json) {
      return
    }
    try {
      const previewText = extractPreviewText(editor)
      await persistDocument(doc.id, JSON.stringify(json), previewText)
      pingSavedPulse()
    }
    catch (e) {
      console.error('Error persisting document:', e)
    }
  }, [doc.id, editor, pingSavedPulse])

  useEffect(() => {
    if (saveSignal) {
      saveCurrentDoc()
      setSaveSignal(false)
    }
  }, [saveCurrentDoc, saveSignal, setSaveSignal])

  useShortcut('ctrl+s', saveCurrentDoc)
  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <DocToolbar />
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-3xl py-12">
          { editor && <DocBubble />}
          <EditorContent editor={editor} />
        </div>
      </div>
      <DocFooter />
    </div>
  )
}
