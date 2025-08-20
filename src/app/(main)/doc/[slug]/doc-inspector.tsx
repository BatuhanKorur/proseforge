'use client'
import type { ReviewResult } from '@/types'
import { Icon } from '@iconify/react'
import { useState } from 'react'
import LookupPanel from '@/app/(main)/doc/[slug]/panels/lookup-panel'
import ReadabilityPanel from '@/app/(main)/doc/[slug]/panels/readability-panel'
import RewritePanel from '@/app/(main)/doc/[slug]/panels/rewrite-panel'
import SpellCheckPanel from '@/app/(main)/doc/[slug]/panels/spell-check-panel'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDocStore } from '@/stores/doc.store'

enum InspectorTabs {
  REVIEW = 'review',
  ASSIST = 'assist',
}

export function DocInspector() {
  const { editorInstance, reviewResults } = useDocStore()

  const [collapsed, setCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState(InspectorTabs.ASSIST)

  return (
    <aside
      aria-expanded={!collapsed}
      onClick={collapsed ? () => setCollapsed(false) : undefined}
      className={cn([
        'relative transition-all duration-200 ease-in-out',
        'border rounded-md ml-4 flex flex-col h-full',
      ], collapsed ? 'w-[52px] cursor-pointer overflow-hidden flex items-center justify-center hover:bg-muted' : 'w-4/12')}
    >
      { collapsed && <Icon icon="ion:ellipsis-vertical" className="size-5" /> }
      { !collapsed && (
        <div className={`${collapsed ? 'pointer-events-none opacity-0' : 'opacity-100'} h-full transition-opacity duration-200`}>
          <InspectorHeading
            onCollapse={() => setCollapsed(true)}
            onTabChange={tab => setActiveTab(tab)}
            activeTab={activeTab}
          />
          {activeTab === InspectorTabs.REVIEW && reviewResults && (
            <TabReview results={reviewResults} />
          )}
          {activeTab === InspectorTabs.ASSIST && (
            <TabAssist />
          )}
        </div>
      )}
    </aside>
  )
}

function InspectorHeading({ onCollapse, onTabChange, activeTab }: {
  onCollapse: () => void
  onTabChange: (tab: InspectorTabs) => void
  activeTab: InspectorTabs
}) {
  const tabs = Object.values(InspectorTabs)
  return (
    <div className="border-b h-9 flex">
      <div className="border-r w-12 flex items-center justify-center shrink-0">
        <Button
          onClick={onCollapse}
          variant="ghost"
          size="icon"
          className="size-6"
        >
          <Icon icon="octicon:sidebar-collapse-24" />
        </Button>
      </div>
      <div className="space-x-2 flex items-center px-2">
        { tabs.map(tab => (
          <button
            type="button"
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn([
              'cursor-pointer capitalize px-4 rounded-full text-[13px] font-medium transition duration-200 ease-in-out',
            ], activeTab === tab ? 'bg-muted' : 'opacity-75 hover:opacity-100')}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
function TabAssist() {
  const { currentAction } = useDocStore()

  if (currentAction === 'lookup') {
    return (
      <LookupPanel />
    )
  }

  if (currentAction === 'rewrite') {
    return (
      <RewritePanel />
    )
  }
  return (
    <div className="h-full flex items-center justify-center">
      <p className="px-20 text-muted-foreground text-center text-sm">Select a word for lookup or a text for review suggestions</p>
    </div>
  )
}

function TabReview({ results }: { results: ReviewResult }) {
  const [activePanel, setActivePanel] = useState('Spell Check')
  const reviewPanels = ['Spell Check', 'Readability']

  return (
    <div>
      <div className="flex justify-between divide-x border-b">
        { reviewPanels.map(panel => (
          <button
            key={panel}
            type="button"
            className={cn(['w-full h-14 text-sm cursor-pointer'], activePanel === panel ? 'font-medium' : 'opacity-50')}
            onClick={() => setActivePanel(panel)}
          >
            { panel }
          </button>
        ))}
      </div>
      {activePanel === 'Spell Check' && <SpellCheckPanel messages={results.spellcheck} />}
      {activePanel === 'Readability' && <ReadabilityPanel messages={results.readability} />}
    </div>
  )
}
