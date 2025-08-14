'use client'
import { Label } from '@/components/ui/label'
import { useDocStore } from '@/stores/doc.store'

enum AssistPanelType {
  LOOKUP,
  REWRITE,
}
export default function AssistPanel() {
  const { currentAction } = useDocStore()

  // Derive the active panel type directly from the store state on each render.
  const activePanel = currentAction === 'rewrite'
    ? AssistPanelType.REWRITE
    : AssistPanelType.LOOKUP

  return (
    <div>
      {/* Conditionally render the panel based on the derived value */}
      {activePanel === AssistPanelType.LOOKUP && <LookupPanel />}
      {activePanel === AssistPanelType.REWRITE && <p>Rewrite Panel Content</p>}
    </div>
  )
}

function LookupPanel() {
  const { lookupResults, editorInstance, selectionData } = useDocStore()
  if (!lookupResults) {
    return (<div></div>)
  }
  const { word, definition, synonyms } = lookupResults
  function handleWordFlip(synonym: string) {
    if (!editorInstance || !selectionData) {
      console.error('Editor instance or selection data not available')
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
      <div>
        <p className="text-2xl font-semibold mb-1">{ word }</p>
      </div>
      <div className="space-y-1">
        <Label>Definition</Label>
        <p>{ definition }</p>
      </div>
      <div className="space-y-1">
        <Label>Synonyms</Label>
        <div className="flex flex-wrap gap-2">
          { synonyms && synonyms.length > 0 && (
            synonyms.map((synonym: string, index: number) => (
              <button
                type="button"
                className="text-left inline-flex border cursor-pointer px-3 py-1 rounded text-[15px] leading-[26px] transition duration-200 ease-in-out hover:bg-muted"
                key={index}
                onClick={() => handleWordFlip(synonym)}
              >
                <p>
                  {synonym}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
