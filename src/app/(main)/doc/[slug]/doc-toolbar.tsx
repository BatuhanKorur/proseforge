'use client'
import type { ComponentProps } from 'react'
import { Icon } from '@iconify/react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useDocStore } from '@/stores/doc.store'

function ToolButton({
  icon,
  isActive = false,
  ...props
}: ComponentProps<'button'> & { icon: string, isActive?: boolean }) {
  return (
    <button
      type="button"
      className={cn([
        'size-6 hover:bg-muted inline-flex items-center justify-center rounded cursor-pointer',
      ], isActive ? 'bg-muted' : '')}
      {...props}
    >
      <Icon icon={icon} className="size-4" />
    </button>
  )
}
export default function DocToolbar() {
  const { editorInstance } = useDocStore()
  if (!editorInstance) {
    return <></>
  }

  return (
    <div className="flex border px-2 py-1.5 rounded-md bg-transparent backdrop-blur-3xl">
      <ToolButton icon="ri:arrow-go-back-line" />
      <ToolButton icon="ri:arrow-go-forward-line" />
      <Separator orientation="vertical" className="mx-2" />
      <ToolButton
        icon="ri:bold"
        onClick={() => editorInstance?.chain().focus().toggleBold().run()}
        isActive={editorInstance.isActive('bold')}
      />
      <ToolButton
        icon="ri:italic"
        onClick={() => editorInstance?.chain().focus().toggleItalic().run()}
      />
      <ToolButton
        icon="ri:underline"
        onClick={() => editorInstance?.chain().focus().toggleUnderline().run()}
      />
      <ToolButton
        icon="ri:strikethrough"
        onClick={() => editorInstance?.chain().focus().toggleStrike().run()}
      />
    </div>
  )
}
