import type { Editor } from '@tiptap/core'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractPreviewText(editor: Editor | null): string {
  if (!editor)
    return ''
  const text = editor.getText()
  return text.slice(0, 240).trim()
}

export function parseDocumentContent(content: string | null) {
  if (!content) {
    return { type: 'doc', content: [{ type: 'paragraph' }] }
  }
  try {
    return JSON.parse(content)
  }
  catch {
    return { type: 'doc', content: [{ type: 'paragraph' }] }
  }
}
