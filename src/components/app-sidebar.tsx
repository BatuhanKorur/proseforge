'use client'
import type { ComponentProps } from 'react'
import type { OllamaStatus } from '@/types'
import { Icon } from '@iconify/react'
import { FileText, Folder } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import * as React from 'react'
import { pingOllama } from '@/actions/lama.actions'
import Logo from '@/components/logo'
import { NavUser } from '@/components/nav-user'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useUserStore } from '@/stores/user.store'

const STATUS_CLASS: Record<OllamaStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-red-500',
  checking: 'bg-yellow-500 animate-pulse',
}

interface NavItem {
  title: string
  url: string
  icon: React.FC<any>
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

const navigation: NavItem[] = [
  {
    title: 'Documents',
    url: '/',
    icon: FileText,
  },
]

const user = {
  name: 'John Doe',
  email: 'johnny@mail.com',
  avatar: '/duck.jpg',
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <NavHeading />
      <SidebarContent>
        <NavMain />
        <NavFavorites />
        <NavSecondary />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

function NavHeading() {
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus>('checking')
  useEffect(() => {
    let cancelled = false

    ;(async function fetchOllamaStatus() {
      try {
        const ok = await pingOllama()
        if (!cancelled)
          setOllamaStatus(ok ? 'online' : 'offline')
      }
      catch (err) {
        if (!cancelled)
          setOllamaStatus('offline')
        console.error('Failed to check Ollama status', err)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const statusDotClass = STATUS_CLASS[ollamaStatus]

  return (
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
                <Tooltip>
                  <TooltipTrigger>
                    <span className="truncate text-xs flex items-center gap-1">
                      <span className={`inline-block size-2 rounded-full capitalize ${statusDotClass}`} />
                      {ollamaStatus}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Ollama status</span>
                  </TooltipContent>
                </Tooltip>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {navigation.map(item => (
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
                          <Icon icon="lucide:chevron-right" />
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

function NavFavorites() {
  const favorites = useUserStore(s => s.favorites)
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarMenu>
        { favorites.map(favorite => (
          <SidebarMenuItem key={favorite.id}>
            <Tooltip delayDuration={500}>
              <TooltipTrigger className="w-full">
                <SidebarMenuButton asChild>
                  <Link href={favorite.id}>
                    <div className="flex items-center gap-2 w-full">
                      <div className="shrink-0">
                        <Folder className="size-3" />
                      </div>
                      <div className="text-sm line-clamp-1">{favorite.title}</div>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent>
                <span>{ favorite.title }</span>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavSecondary() {
  const { setTheme } = useTheme()
  return (
    <SidebarContent>
      <SidebarGroup className="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="sm">
                <Icon icon="lucide:cog" />
                <p>Settings</p>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Icon icon="lucide:moon" />
                    <p>Theme</p>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end">
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <p>Dark</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    <p>Light</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}
