'use client'
import type { Document } from '@/generated/prisma'
import { EditorContent } from '@tiptap/react'
import { useCallback } from 'react'
import DocBubble from '@/app/(main)/doc/[slug]/doc-bubble'
import DocToolbar from '@/app/(main)/doc/[slug]/doc-toolbar'
import { useEditorSetup } from '@/hooks/use-editor-setup'
import { useShortcut } from '@/hooks/use-shortcut'
import { useDocStore } from '@/stores/doc.store'

export default function DocEditor({ doc }: { doc: Document }) {
  const { saveDocument } = useDocStore()
  const editor = useEditorSetup(doc)
  useShortcut('ctrl+s', () => saveDocument(doc.id))

  const handleContentAreaClick = useCallback(() => {
    editor?.commands.focus()
  }, [editor])

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <DocToolbar />
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-5"
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
