import { cn } from '@/lib/utils'
import { useDocStore } from '@/stores/doc.store'

export default function DocFooter() {
  const { editorInstance, wordCount, characterCount } = useDocStore()
  if (!editorInstance)
    return null
  return (
    <footer
      className={cn([
        'h-6 flex items-center justify-between',
        'px-3 pt-2 border-t',
        'text-[13px] text-muted-foreground',
        // 'mx-auto w-full max-w-3xl shrink-0 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-xs text-muted-foreground',
      ])}
    >
      <div>
        <span></span>
      </div>
      <div className="space-x-2">
        <span>
          Characters:
          { characterCount }
        </span>
        <span>
          Words:
          { wordCount }
        </span>
      </div>
    </footer>
  )
}
