'use client'
import type { Document } from '@/generated/prisma'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useEffect } from 'react'
import { persistDocument } from '@/actions/doc.actions'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

export default function DocEditor({ doc }: {
  doc: Document
}) {
  if (!doc.content)
    return null
  const initialContent = JSON.parse(doc.content as string)

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false,
  })

  const saveCurrentDoc = useCallback(async () => {
    const json = editor?.getJSON()
    if (!json)
      return
    const serialized = JSON.stringify(json)
    await persistDocument(doc.id, serialized)
  }, [doc.id, editor])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey
      const isSKey = e.key === 's' || e.key === 'S'
      if (cmdOrCtrl && isSKey) {
        e.preventDefault()
        if (e.repeat)
          return
        // If you want to ignore saves while typing in inputs/contenteditable, add a guard here.
        saveCurrentDoc()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [saveCurrentDoc])

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={75}>
        <div className="flex items-center justify-between">
          <p>Title</p>
          <Button onClick={saveCurrentDoc}>Save</Button>
        </div>
        <div className="bg-muted p-2 min-h-full">
          <EditorContent editor={editor} />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
