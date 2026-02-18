'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { DocTreeItem } from '@/utils/document-tree'
import { usePathname } from 'next/navigation'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

// 判断当前 item 或其子孙是否匹配当前路径
function itemMatchesPath(item: DocTreeItem, pathname: string): boolean {
  if (item.url === pathname) return true
  if (item.items) {
    return item.items.some((child: DocTreeItem) => itemMatchesPath(child, pathname))
  }
  return false
}

// 二级手风琴: 全局只允许一个二级分组展开, 用 url 作为唯一 key
function useSecondLevelAccordion(doctree: DocTreeItem[]) {
  const pathname = usePathname()
  // 找出当前路径所在的二级 key, 用于初始展开
  const initialKey = (() => {
    for (const root of doctree) {
      if (!root.items) continue
      for (const second of root.items) {
        if (itemMatchesPath(second, pathname)) return second.url
      }
    }
    return null
  })()
  const [openSecondKey, setOpenSecondKey] = useState<string | null>(() => initialKey)

  useEffect(() => {
    const key = (() => {
      for (const root of doctree) {
        if (!root.items) continue
        for (const second of root.items) {
          if (itemMatchesPath(second, pathname)) return second.url
        }
      }
      return null
    })()
    if (key) setOpenSecondKey(key)
  }, [pathname, doctree])

  return { openSecondKey, setOpenSecondKey }
}

function RecursiveMenuItem({
  item,
  depth = 0,
  openSecondKey,
  setOpenSecondKey,
}: {
  item: DocTreeItem
  depth?: number
  openSecondKey: string | null
  setOpenSecondKey: (key: string | null) => void
}) {
  const pathname = usePathname()
  const hasChildren = item.items && item.items.length > 0
  const shouldBeOpen = itemMatchesPath(item, pathname)

  // 一级(depth 0): 可折叠，本地状态；二级(depth 1): 手风琴；更深(depth>=2): 本地状态
  const isSecondLevel = depth === 1
  const [openLocal, setOpenLocal] = useState(true)

  useEffect(() => {
    if (shouldBeOpen) setOpenLocal(true)
  }, [pathname, shouldBeOpen])

  const open = isSecondLevel ? openSecondKey === item.url : openLocal

  const handleOpenChange = (next: boolean) => {
    if (isSecondLevel) {
      setOpenSecondKey(next ? item.url : null)
    } else {
      setOpenLocal(next)
    }
  }

  if (!hasChildren) {
    return (
      <SidebarMenuItem
        className={cn(
          'rounded-md transition-all duration-200',
          depth > 0 && 'text-sidebar-foreground/90'
        )}
      >
        <SidebarMenuButton asChild tooltip={item.title}>
          <Link
            href={item.url}
            className={cn(
              'hover:bg-primary/10! hover:dark:bg-primary/20! transition-all duration-200 ease-in-out',
              pathname === item.url && 'bg-primary/5 dark:bg-primary/10'
            )}
          >
            {item.icon && <item.icon />}
            <span className="transition-all duration-200">{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible asChild open={open} onOpenChange={handleOpenChange}>
      <SidebarMenuItem
        className={cn(
          'rounded-md',
          depth > 0 && 'text-sidebar-foreground/90'
        )}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className="transition-all duration-200 ease-in-out hover:bg-primary/5 dark:hover:bg-primary/10"
          >
            {item.icon && <item.icon />}
            <span className="transition-all duration-200">{item.title}</span>
            <ChevronRight
              className={cn(
                'ml-auto shrink-0 transition-transform duration-200 ease-out',
                open && 'rotate-90'
              )}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden transition-[height,opacity] duration-200 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:duration-150 data-[state=open]:duration-200">
          <SidebarMenuSub className="ml-0.5 space-y-0.5 border-l border-sidebar-border/50 pl-3 py-1">
            {item.items?.map((child: DocTreeItem) => (
              <RecursiveMenuItem
                key={child.title}
                item={child}
                depth={depth + 1}
                openSecondKey={openSecondKey}
                setOpenSecondKey={setOpenSecondKey}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function NavMain({ doctree }: { doctree: DocTreeItem[] }) {
  const { openSecondKey, setOpenSecondKey } = useSecondLevelAccordion(doctree)

  return (
    <SidebarGroup>
      <SidebarMenu className="mt-8 gap-1.5">
        {doctree.map((item) => (
          <RecursiveMenuItem
            key={item.title}
            item={item}
            depth={0}
            openSecondKey={openSecondKey}
            setOpenSecondKey={setOpenSecondKey}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
