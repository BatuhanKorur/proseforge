import type { ComponentProps } from 'react'
import { BubbleMenu } from '@tiptap/react/menus'

import { cn } from '@/lib/utils'
import { useDocStore } from '@/stores/doc.store'

export default function DocBubble() {
  const { editorInstance, selectionData, getRewriteSuggestions, getLookupResults } = useDocStore()
  if (!editorInstance)
    return null

  const closeBubble = () => {
    const pos = editorInstance.state.selection.to
    editorInstance.chain().focus().setTextSelection(pos).run()
  }

  const handleTextRewrite = () => {
    getRewriteSuggestions()
    closeBubble()
  }

  const handleWordLookup = () => {
    getLookupResults()
    closeBubble()
  }

  return (
    <BubbleMenu
      editor={editorInstance}
      updateDelay={300}
      options={{
        placement: 'bottom',
        offset: 8,
      }}
    >
      <div className="bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md outline-hidden">
        <BubbleButton onClick={selectionData.isText ? handleTextRewrite : handleWordLookup}>
          <p>{ selectionData.isText ? 'Rewrite with AI' : 'Lookup Word'}</p>
        </BubbleButton>
      </div>
    </BubbleMenu>
  )
}
function BubbleButton({ children, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn([
        'relative w-full flex items-center gap-2 z-50',
        'px-2 py-1.5 text-sm hover:bg-muted',
        'cursor-pointer outline-hidden select-none transition duration-200 ease-in-out',
      ])}
      {...props}
    >
      { children }
    </button>
  )
}
