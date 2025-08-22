'use client'
import type { ComponentProps } from 'react'
import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
      <ToolLink />

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

function ToolLink() {
  const { editorInstance } = useDocStore()
  const [isOpen, setOpen] = useState(false)
  const [link, setLink] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editorInstance) return

    const updateLinkState = () => {
      const link = editorInstance?.getAttributes('link').href || ''
      if (link) {
        setLink(link)
        setOpen(true)
        inputRef.current?.focus()
      }
      else {
        setLink('')
        setOpen(false)
      }
    }
    editorInstance.on('selectionUpdate', updateLinkState)

    return () => {
      editorInstance.off('selectionUpdate', updateLinkState)
    }
  }, [editorInstance])

  function handleLinkOpen() {
    if (!editorInstance) return
    console.log('Handle Link Open')
  }

  function handleSetLink() {
    if (!editorInstance) return
    const href = link.trim()
    editorInstance.chain().focus().setLink({
      href,
    }).run()
    console.log('Handle Link')
  }

  function handleUnlink() {
    if (!editorInstance) return
    editorInstance.chain().focus().unsetLink().run()
    editorInstance.commands.focus()
    setOpen(false)
  }

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <ToolButton
          icon="tabler:link"
          label="Link"
          onClick={() => setOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="inline-flex p-1 min-w-80">
        <div className="flex-1 flex pl-2 items-center border-r my-1">
          <input
            ref={inputRef}
            type="url"
            inputMode="url"
            className="h-full text-sm w-full focus:outline-none"
            placeholder="Paste a link..."
            value={link}
            onChange={e => setLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSetLink()
              }
            }}
          />
          <div className="mr-2">
            <Icon icon="mi:enter" className="size-4.5 opacity-40" />
          </div>
        </div>
        <div className="flex space-x-1 px-1">
          <button
            type="button"
            className="size-8.5 flex items-center justify-center cursor-pointer rounded-md transition duration-200 ease-in-out hover:bg-muted"
            onClick={handleLinkOpen}
          >
            <Icon icon="tabler:external-link" className="size-4.5 opacity-80" />
          </button>
          <button
            type="button"
            className="size-8.5 flex items-center justify-center cursor-pointer rounded-md transition duration-200 ease-in-out hover:bg-muted"
            onClick={handleUnlink}
          >
            <Icon icon="tabler:link-off" className="size-4.5 opacity-80" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
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
