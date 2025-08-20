'use client'
import { Label } from '@/components/ui/label'
import Loader from '@/components/ui/loader'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useDocStore } from '@/stores/doc.store'

export default function LookupPanel() {
  const { lookupResults, isWaitingResponse, editorInstance, selectionData } = useDocStore()

  if (isWaitingResponse) {
    return <Loader className="h-full" />
  }

  if (!lookupResults || Object.keys(lookupResults).length === 0) {
    return <div>No results found.</div>
  }

  const { word, definition, synonyms } = lookupResults

  function handleWordFlip(synonym: string) {
    if (!editorInstance) {
      console.error('Editor instance not available')
      return
    }
    editorInstance
      .chain()
      .focus()
      .setTextSelection({ from: selectionData.from, to: selectionData.to })
      .insertContent(synonym)
      .run()
  }
  return (
    <div className="flex flex-col gap-3 px-8 py-6">
      <h1 className="text-3xl font-semibold mb-2 lowercase">{ word }</h1>
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <Label>Definition</Label>
          <p className="">{ definition }</p>
        </div>
        <div className="space-y-2">
          <Label>Synonyms</Label>
          <div className="flex flex-wrap gap-2">
            { synonyms && synonyms.length > 0
              ? (
                  synonyms.map((synonym: { word: string, definition: string }, index: number) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="text-left inline-flex border cursor-pointer px-3 py-1 rounded text-[15px] leading-[26px] transition duration-200 ease-in-out hover:bg-muted"
                          key={index}
                          onClick={() => handleWordFlip(synonym.word)}
                        >
                          <p>
                            {synonym.word}
                          </p>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={4}>
                        <p>{synonym.definition}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))
                )
              : <div>No synonyms found.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
