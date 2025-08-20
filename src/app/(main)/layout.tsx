import type { ReactNode } from 'react'
import { AppSidebar } from '@/components/app-sidebar'

import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export default function MainLayout({ children, header }: { children: ReactNode, header: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-6"
            />
            { header }
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 py-4 pt-0 px-4">
          { children }
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
