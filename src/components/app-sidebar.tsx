'use client'
import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import type { OllamaStatus } from '@/types'
import {
  ChevronRight,
  FileText,
  Folder,
  LifeBuoy,
  Send,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { pingOllama } from '@/actions/lama.actions'
import Logo from '@/components/logo'
import { NavUser } from '@/components/nav-user'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { useUserStore } from '@/stores/user.store'

const data = {
  user: {
    name: 'John Doe',
    email: 'johnny@mail.com',
    avatar: '/duck.jpg',
  },
  navMain: [
    {
      title: 'Documents',
      url: '/',
      icon: FileText,
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '/',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '/',
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const [showSettings, setShowSettings] = useState(false)
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus>('checking')
  const favorites = useUserStore(s => s.favorites)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const ok = await pingOllama()
        if (!cancelled)
          setOllamaStatus(ok ? 'running' : 'offline')
      }
      catch {
        if (!cancelled)
          setOllamaStatus('offline')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const statusDotClass = ollamaStatus === 'running'
    ? 'bg-green-500'
    : ollamaStatus === 'offline'
      ? 'bg-red-500'
      : 'bg-yellow-500 animate-pulse'

  const statusText = ollamaStatus === 'running' ? 'Online' : ollamaStatus === 'offline' ? 'Offline' : 'Checking...'

  const handleOpenSettings = () => {
    console.log('Hello')
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-black text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-lg">
                  <Logo className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Prose Forge</span>
                  <span className="truncate text-xs flex items-center gap-1">
                    <span className={`inline-block size-2 rounded-full ${statusDotClass}`} />
                    {statusText}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarMenu>
            { favorites.map(favorite => (
              <SidebarMenuItem key={favorite.id}>
                <SidebarMenuButton asChild>
                  <Link href={favorite.id}>
                    <div className="flex items-center gap-2">
                      <Folder className="size-3" />
                      <span>{favorite.title}</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup {...props} className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem onClick={handleOpenSettings}>
                <SidebarMenuButton asChild size="sm">
                  <div>
                    <Settings />
                    <p>Settings</p>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map(item => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length
                ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map(subItem => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  )
                : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
