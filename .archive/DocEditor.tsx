'use client'
import type { Document } from '@/generated/prisma'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useState } from 'react'
import { persistDocument, updateDocumentTitle } from '@/actions/doc.actions'
import WordPanel from '@/app/(main)/doc/[slug]/word-panel'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useShortcut } from '@/hooks/use-keyboard'

export default function DocEditor({ doc }: {
  doc: Document
}) {
  const [title, setTitle] = useState(doc?.title || '')
  const [selectedWord, setSelectedWord] = useState('')

  const handleWordSelected = useCallback((word: string) => {
    setSelectedWord(word)
  }, [])

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'doc-edit',
      },
    },
    // Fires whenever the selection changes
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection
      if (from === to)
        return // empty caret, nothing selected

      // Grab the selected text from the document
      const selected = editor.state.doc.textBetween(from, to, ' ')
      const trimmed = selected.trim()

      // Only act on a single "word" (no whitespace inside)
      if (trimmed && !/\s/.test(trimmed)) {
        handleWordSelected(trimmed)
      }
    },

  })

  const saveCurrentDoc = useCallback(async () => {
    const json = editor?.getJSON()
    if (!json)
      return
    const serialized = JSON.stringify(json)
    await persistDocument(doc.id, serialized)
  }, [doc.id, editor])

  const saveTitle = async () => {
    if (title === doc?.title) {
      return
    }
    try {
      await updateDocumentTitle(doc.id, title)
    }
    catch (e) {
      console.error('Error saving title:', e)
    }
  }

  useShortcut('ctrl+s', saveCurrentDoc)

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={75} minSize={60}>
        <div className="flex items-center justify-between">
          <input value={title} onChange={e => setTitle(e.target.value)} onBlur={saveTitle} />
          <Button onClick={saveCurrentDoc}>Save</Button>
        </div>
        <div className="p-2 min-h-full">
          <EditorContent editor={editor} />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} minSize={10}>
        <WordPanel word={selectedWord} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
