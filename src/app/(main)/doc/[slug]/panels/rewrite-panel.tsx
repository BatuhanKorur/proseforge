import type { RewriteSuggestion } from '@/types'
import Loader from '@/components/ui/loader'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useDocStore } from '@/stores/doc.store'

const RewriteTypes = {
  GENERAL: 'general',
  SHORT: 'shorter',
  SPECIFIC: 'specific',
}

const RewriteDescriptions = {
  [RewriteTypes.GENERAL]: 'An overall general rewrite of the selected text.',
  [RewriteTypes.SHORT]: 'A short, concise rewrite of the selected text.',
  [RewriteTypes.SPECIFIC]: 'A more targeted rewrite of the selected text, making it a little longer.',
}

export default function RewritePanel() {
  const { isWaitingResponse, rewriteResults } = useDocStore()

  if (isWaitingResponse) {
    return <Loader className="h-full" />
  }

  if (!rewriteResults || Object.keys(rewriteResults).length === 0) {
    return <div>No suggestions found.</div>
  }

  function handleRewriteChange(suggestion: string) {
    console.log('Suggestion:', suggestion)
  }

  return (
    <div className="flex flex-col gap-3 px-8 py-6">
      <h1>Rewrite Suggestions</h1>
      <div className="flex flex-col space-y-4">
        {rewriteResults.map((suggestion: RewriteSuggestion, index: number) => (
          <div key={index} className="flex flex-col">
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-left text-sm text-blue-200 font-medium capitalize">{ suggestion.id }</p>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" sideOffset={4}>
                  <p>{RewriteDescriptions[suggestion.id as keyof typeof RewriteDescriptions]}</p>
                </TooltipContent>
              </Tooltip>
              <button
                type="button"
                className="text-xs border px-2 py-1 rounded-full"
                onClick={() => handleRewriteChange(suggestion.text)}
              >
                Change
              </button>
            </div>
            <p className="text-[15px] text-pretty">
              {suggestion.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
