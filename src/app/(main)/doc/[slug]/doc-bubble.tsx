import type { Editor } from '@tiptap/core'
import type { ComponentProps } from 'react'
import { BubbleMenu } from '@tiptap/react/menus'

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
export default function DocBubble({ editor, isText }: { editor: Editor, isText: boolean }) {
  const closeBubble = () => {
    const pos = editor.state.selection.to
    editor.chain().focus().setTextSelection(pos).run()
  }

  const handleTextRewrite = () => {
    console.log('Hello World!')
    closeBubble()
  }

  const handleWordLookup = () => {
    console.log('Word Lookup')
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
      <div className="bg-popover text-popover-foreground z-50 w-72 rounded-md border p-2 shadow-md outline-hidden">
        <BubbleButton onClick={isText ? handleTextRewrite : handleWordLookup}>
          <p>{ isText ? 'Rewrite with AI' : 'Lookup Word'}</p>
        </BubbleButton>
      </div>
    </BubbleMenu>
  )
}
