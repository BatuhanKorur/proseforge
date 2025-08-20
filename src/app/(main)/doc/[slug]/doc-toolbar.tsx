'use client'
import type { ComponentProps } from 'react'
import { Icon } from '@iconify/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useDocStore } from '@/stores/doc.store'

export default function DocToolbar() {
  const { editorInstance, characterCount, wordCount } = useDocStore()

  if (!editorInstance) {
    return <></>
  }

  return (
    <div className="flex border px-2.5 py-1.5 rounded-md gap-1">
      <ToolButton
        icon="tabler:arrow-back"
        label="Undo"
        onClick={() => editorInstance?.commands.undo()}
      />
      <ToolButton
        icon="tabler:arrow-forward"
        label="Redo"
        onClick={() => editorInstance?.commands.redo()}
      />
      <Separator orientation="vertical" className="mx-1.5" />
      <ToolHeading />
      <ToolList />
      <ToolButton
        icon="tabler:blockquote"
        label="Blockquote"
        onClick={() => editorInstance?.chain().focus().toggleBlockquote().run()}
      />
      <ToolButton
        icon="tabler:brackets-contain"
        label="Code Block"
        onClick={() => editorInstance?.chain().focus().toggleCodeBlock().run()}
      />

      <Separator orientation="vertical" className="mx-1.5" />
      <ToolButton
        icon="ri:bold"
        label="Bold"
        onClick={() => editorInstance?.chain().focus().toggleBold().run()}
        isActive={editorInstance.isActive('bold')}
      />
      <ToolButton
        icon="ri:italic"
        label="Italic"
        onClick={() => editorInstance?.chain().focus().toggleItalic().run()}
      />
      <ToolButton
        icon="ri:underline"
        label="Underline"
        onClick={() => editorInstance?.chain().focus().toggleUnderline().run()}
      />
      <ToolButton
        icon="ri:strikethrough"
        label="Strikethrough"
        onClick={() => editorInstance?.chain().focus().toggleStrike().run()}
      />
      <ToolButton
        icon="tabler:code"
        label="Code"
      />
      <ToolButton
        icon="tabler:link"
        label="Link"
      />
      <Separator orientation="vertical" className="mx-1.5" />
      <ToolButton
        icon="tabler:align-left"
        onClick={() => editorInstance.chain().focus().setTextAlign('left').run()}
      />
      <ToolButton
        icon="tabler:align-center"
        onClick={() => editorInstance.chain().focus().setTextAlign('center').run()}
      />
      <ToolButton
        icon="tabler:align-right"
        onClick={() => editorInstance.chain().focus().setTextAlign('right').run()}
      />
      <Separator orientation="vertical" className="mx-1.5" />
      <ToolButton
        icon="tabler:line-dashed"
        label="Horizontal Rule"
        onClick={() => editorInstance?.chain().focus().setHorizontalRule().run()}
      />
      <div className="flex-1 flex justify-end">
        <Tooltip>
          <TooltipTrigger asChild className="flex items-center">
            <p className="leading-0 text-sm space-x-1.5 text-muted-foreground">
              <span>{ characterCount }</span>
              <span>/</span>
              <span>{ wordCount }</span>
            </p>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={2}>
            <p>Character Count / Word Count</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

function ToolButton({
  icon,
  label,
  isActive = false,
  disabled = false,
  className,
  ...props
}: ComponentProps<'button'> & {
  icon: string
  className?: string
  label?: string
  disabled?: boolean
  isActive?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn([
            'size-6.5 hover:bg-muted inline-flex items-center justify-center rounded-md cursor-pointer',
          ], isActive ? 'bg-muted' : '', disabled ? 'opacity-50 cursor-not-allowed' : '', className)}
          {...props}
        >
          <Icon icon={icon} className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={2}>
        <span>{ label }</span>
      </TooltipContent>
    </Tooltip>

  )
}

function ToolHeading() {
  const { editorInstance } = useDocStore()
  function handleHeadingClick(lvl: number) {
    // @ts-ignore
    editorInstance?.chain().focus().toggleHeading({ level: lvl }).run()
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolButton icon="tabler:heading" label="Heading" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleHeadingClick(1)}>
          <Icon icon="gridicons:heading-h1" />
          Heading 1
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleHeadingClick(2)}>
          <Icon icon="gridicons:heading-h2" />
          Heading 2
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleHeadingClick(3)}>
          <Icon icon="gridicons:heading-h3" />
          Heading 3
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleHeadingClick(3)}>
          <Icon icon="gridicons:heading-h4" />
          Heading 4
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ToolList() {
  const { editorInstance } = useDocStore()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolButton icon="tabler:list" label="List" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => editorInstance?.chain().focus().toggleBulletList().run()}>
          <Icon icon="tabler:list-numbered" />
          Bullet List
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editorInstance?.chain().focus().toggleOrderedList().run()}>
          <Icon icon="tabler:list-nested" />
          Ordered List
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
