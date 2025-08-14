import type { Editor } from '@tiptap/core'
import type { ComponentProps } from 'react'
import { BubbleMenu } from '@tiptap/react/menus'
import { useDocStore } from '@/stores/doc.store'

function BubbleButton({ children, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className="w-full relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-sm outline-hidden select-none transition duration-200 ease-in-out hover:bg-muted"
      {...props}
    >
      { children }
    </button>
  )
}
export default function DocBubble({
  editor,
  isText,
  selected,
}: { editor: Editor, isText: boolean, selected: string }) {
  const docStore = useDocStore()
  const closeBubble = () => {
    const pos = editor.state.selection.to
    editor.chain().focus().setTextSelection(pos).run()
  }

  const handleTextRewrite = () => {
    docStore.triggerRewrite(selected)
    closeBubble()
  }

  const handleWordLookup = () => {
    docStore.triggerLookup(selected)
    closeBubble()
  }

  return (
    <BubbleMenu
      editor={editor}
      updateDelay={300}
      options={{
        placement: 'bottom',
        offset: 8,
      }}
    >
      <div className="bg-popover text-popover-foreground z-50 w-52 rounded border p-1.5 shadow-lg outline-hidden">
        <BubbleButton onClick={isText ? handleTextRewrite : handleWordLookup}>
          <p>{ isText ? 'Rewrite with AI' : 'Lookup Word'}</p>
        </BubbleButton>
      </div>
    </BubbleMenu>
  )
}
