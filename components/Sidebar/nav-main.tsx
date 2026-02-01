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

function RecursiveMenuItem({ item, depth = 0 }: { item: DocTreeItem; depth?: number }) {
  const pathname = usePathname()
  const hasChildren = item.items && item.items.length > 0

  const shouldBeOpen = itemMatchesPath(item, pathname)
  // 默认全部展开
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (shouldBeOpen) setOpen(true)
  }, [pathname, shouldBeOpen])

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
    <Collapsible asChild open={open} onOpenChange={setOpen}>
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
                'ml-auto transition-all duration-300 ease-in-out transform',
                open && 'rotate-90'
              )}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <SidebarMenuSub className="ml-0.5 space-y-0.5 border-l border-sidebar-border/50 pl-3 py-1">
            {item.items?.map((child: DocTreeItem) => (
              <RecursiveMenuItem key={child.title} item={child} depth={depth + 1} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function NavMain({ doctree }: { doctree: DocTreeItem[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu className="mt-8 gap-1.5">
        {doctree.map((item) => (
          <RecursiveMenuItem key={item.title} item={item} depth={0} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
