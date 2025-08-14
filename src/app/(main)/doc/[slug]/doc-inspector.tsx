'use client'

import type { ComponentProps } from 'react'
import type { ReadabilityResult, SpellCheckResult } from '@/actions/review.actions'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { analyze } from '@/actions/review.actions'
import AssistPanel from '@/app/(main)/doc/[slug]/panels/assist-panel'
import ReadabilityPanel from '@/app/(main)/doc/[slug]/panels/readability-panel'
import SpellCheckPanel from '@/app/(main)/doc/[slug]/panels/spell-check-panel'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDocStore } from '@/stores/doc.store'
import { DocInspectorType, DocPanelType } from '@/types'

export function DocInspector() {
  const { isWaitingResponse, currentAction, editorInstance } = useDocStore()
  const [collapsed, setCollapsed] = useState(false)
  const [inspectorPanel, setInspectorPanel] = useState<DocInspectorType>(DocInspectorType.ANALYSIS)
  const [activePanel, setActivePanel] = useState(DocPanelType.SPELLCHECK)

  const [spellChecks, setSpellChecks] = useState<SpellCheckResult[]>([])
  const [readability, setReadability] = useState<ReadabilityResult[]>([])

  const handleAnalysis = async () => {
    setInspectorPanel(DocInspectorType.ANALYSIS)
    const text = editorInstance?.getText()
    if (!text) {
      return
    }

    const m = await analyze(text)
    setSpellChecks(m.spellcheck)
    setReadability(m.readability)

    try {
      // @ts-ignore
      editorInstance?.commands.setSpellErrors(m.spellcheckWords || [])
    }
    catch (e) {
      console.error('Error setting spell errors:', e)
    }
  }

  const handleAssist = async () => {
    setInspectorPanel(DocInspectorType.ASSIST)
  }

  useEffect(() => {
    handleAnalysis()
  }, [editorInstance])

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
        'relative transition-all duration-200 ease-in-out',
        'border rounded-md ml-4 flex flex-col h-full',
      ], collapsed ? 'w-[52px] cursor-pointer overflow-hidden flex items-center justify-center hover:bg-muted' : 'w-4/12')}
    >
      { collapsed && <Icon icon="ion:ellipsis-vertical" className="size-5" /> }
      { !collapsed && (
        <div
          id="right-panel-content"
          aria-hidden={collapsed}
          className={`${collapsed ? 'pointer-events-none opacity-0' : 'opacity-100'} h-full transition-opacity duration-200`}
        >
          <div className="flex h-8 border-b">
            <div className="border-r w-12 flex items-center justify-center shrink-0">
              <Button
                onClick={() => setCollapsed(true)}
                variant="ghost"
                size="icon"
                className="size-6"
              >
                <Icon icon="octicon:sidebar-collapse-24" />
              </Button>
            </div>
            <div className="w-full flex items-center">
              <button
                type="button"
                onClick={handleAnalysis}
                className="px-6 text-sm border-r h-full font-medium cursor-pointer"
              >
                Analysis
              </button>
              <button
                type="button"
                onClick={handleAssist}
                className="px-6 text-sm border-r h-full font-medium cursor-pointer"
              >
                Assist
              </button>
            </div>
          </div>
          { inspectorPanel === DocInspectorType.ASSIST && (
            <AssistPanel />
          )}
          { inspectorPanel === DocInspectorType.ANALYSIS && (
            <div>
              <div className="border-t flex justify-between divide-x border-b">
                <DocPanelButton label="Spell" onClick={() => setActivePanel(DocPanelType.SPELLCHECK)} />
                <DocPanelButton label="Readability" onClick={() => setActivePanel(DocPanelType.READABILITY)} />
              </div>
              <div className="h-full overflow-y-scroll">
                { activePanel === DocPanelType.SPELLCHECK && (
                  <SpellCheckPanel checks={spellChecks} />
                )}
                { activePanel === DocPanelType.READABILITY && (
                  <ReadabilityPanel messages={readability} />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}

export function DocPanelButton({ label, ...props }: ComponentProps<'button'> & {
  label: string
}) {
  return (
    <button
      type="button"
      className="w-full h-14 text-sm cursor-pointer"
      {...props}
    >
      { label }
    </button>
  )
}
