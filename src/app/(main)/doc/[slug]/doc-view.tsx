'use client'
import type { Document } from '@/generated/prisma'
import { CharacterCount } from '@tiptap/extensions'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { persistDocument } from '@/actions/doc.actions'
import DocBubble from '@/app/(main)/doc/[slug]/doc-bubble'
import { useShortcut } from '@/hooks/use-keyboard'
import { extractPreviewText, parseDocumentContent } from '@/lib/utils'
import { useDocStore } from '@/stores/doc.store'

export default function DocView({ doc }: {
  doc: Document
}) {
  const { saveSignal, setSaveSignal, pingSavedPulse } = useDocStore()
  const [collapsed, setCollapsed] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [selectedFrom, setSelectedFrom] = useState(0)
  const [selectedTo, setSelectedTo] = useState(0)
  const [selected, setSelected] = useState('')
  const [isText, setIsText] = useState(false)

  const resetSelected = () => {
    setSelected('')
    setIsText(false)
    setSelectedFrom(0)
    setSelectedTo(0)
  }

  // Setup initial content from the document
  const initialContent = useMemo(() => {
    return parseDocumentContent(doc?.content as string)
  }, [doc.content])

  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const debouncedSelectionUpdate = useCallback((selection: any, editorInstance: any) => {
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current)
    }

    // Set new timeout
    selectionTimeoutRef.current = setTimeout(() => {
      if (selection.empty) {
        resetSelected()
        return
      }
      const selected = editorInstance.state.doc.textBetween(selection.from, selection.to)
      setSelectedFrom(selection.from)
      setSelectedTo(selection.to)
      setSelected(selected)
      setIsText(selected.includes(' ') && selected.trim().length > 10)

      console.log(selectedFrom, selectedTo)
    }, 300) // 0.3 second delay
  }, [])

  // Setup the editor instance
  const editor = useEditor({
    extensions: [StarterKit, CharacterCount],
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
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-3xl py-12">
          { editor && (
            <DocBubble
              editor={editor}
              isText={isText}
              selected={selected}
            />
          )}
          <EditorContent editor={editor} />
        </div>
      </div>

      <footer className="mx-auto w-full max-w-3xl shrink-0 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 pt-3 text-xs text-muted-foreground">
        <div className="flex items-center justify-between gap-3">
          <span>
            Characters:
            { characterCount }
          </span>
          <span>
            Words:
            { wordCount }
          </span>
        </div>
      </footer>
    </div>
  )
}
