'use client'
import { ArrowRightToLine, Ellipsis } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Loader from '@/components/ui/loader'
import { cn } from '@/lib/utils'
import { useDocStore } from '@/stores/doc.store'

export function DocPanel() {
  const { isWaitingResponse, currentAction } = useDocStore()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (isWaitingResponse) {
      console.log('OK something changed bro')
      console.log('current action:', currentAction)
    }
  }, [isWaitingResponse, currentAction])
  return (
    <aside
      id="right-panel"
      aria-expanded={!collapsed}
      onClick={collapsed ? () => setCollapsed(false) : undefined}
      role={collapsed ? 'button' : undefined}
      tabIndex={collapsed ? 0 : -1}
      title={collapsed ? 'Expand' : undefined}
      className={cn([
        'relative overflow-hidden transition-all duration-200 ease-in-out',
        'border my-4 rounded-md ml-4',
      ], collapsed ? 'w-[52px] cursor-pointer' : 'w-4/12')}
    >
      { collapsed && (
        <div className="flex h-full items-center justify-center bg-card/50 transition duration-200 ease-in-out cursor-pointer hover:bg-card">
          <Ellipsis className="size-5 text-muted-foreground" />
        </div>
      )}
      <div
        id="right-panel-content"
        aria-hidden={collapsed}
        className={`${collapsed ? 'pointer-events-none opacity-0' : 'opacity-100'} h-full transition-opacity duration-200`}
      >
        <div className="px-3 py-3">
          <Button
            onClick={() => setCollapsed(true)}
            variant="ghost"
            size="icon"
          >
            <ArrowRightToLine />
          </Button>
        </div>
        <div className="px-4.5">
          { isWaitingResponse && <Loader className="h-80" /> }
          { !isWaitingResponse && currentAction === 'lookup' && (
            <LookupPanel />
          )}
          { !isWaitingResponse && currentAction === 'rewrite' && (
            <RewritePanel />
          )}
        </div>
      </div>
    </aside>
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
    <div className="flex flex-col gap-3">
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

function RewritePanel() {
  const { rewriteResults, editorInstance, selectionData } = useDocStore()
  if (!rewriteResults) {
    return (<div></div>)
  }
  return (
    <div>
      {rewriteResults.map((result: string, index: number) => (
        <div key={index}>
          <p>{result}</p>
        </div>
      ))}
      <p>Rewrite Panel</p>
    </div>
  )
}
