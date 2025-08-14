'use client'
import type { ReactNode } from 'react'
import { ArrowRightToLine, Ellipsis } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/loader'
import { cn } from '@/lib/utils'
import { useDocStore } from '@/stores/doc.store'

export function DocPanel({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

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
          <p>hi</p>
        </div>
      </div>
    </aside>
  )
}
export function DocRewrite() {
  const { isRewriting, rewriteResults } = useDocStore()

  return (
    <DocPanel>
      <p>Doc Panel</p>
      { isRewriting && <Loader className="h-80" /> }
      { !isRewriting && (
        <div className="flex flex-col space-y-2">
          { rewriteResults && rewriteResults.length > 0 && (
            rewriteResults.map((result, index) => (
              <button
                type="button"
                key={index}
                className="border p-3 rounded cursor-pointer text-left transition duration-200 ease-in-out hover:bg-muted"
              >
                <p className="text-sm leading-5.5">{result}</p>
              </button>
            ))
          )}
        </div>
      )}
    </DocPanel>
  )
}
