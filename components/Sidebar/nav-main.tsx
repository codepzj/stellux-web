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

// 判断当前 item 或其子孙是否匹配当前路径, 用于判断当前路径是否在 sidebar 中
function itemMatchesPath(item: DocTreeItem, pathname: string): boolean {
  if (item.url === pathname) return true
  if (item.items) {
    return item.items.some((child: DocTreeItem) => itemMatchesPath(child, pathname))
  }
  return false
}

// 二级手风琴(按一级隔离): 每个一级分组内只允许一个二级分组展开
// 使用 rootKey/secondKey 为「url-索引」保证唯一, 避免同 url 多节点同时展开
function useSecondLevelAccordionByRoot(doctree: DocTreeItem[]) {
  const pathname = usePathname()
  const findMatch = () => {
    for (let rootIndex = 0; rootIndex < doctree.length; rootIndex++) {
      const root = doctree[rootIndex]
      if (!root.items) continue
      for (let secondIndex = 0; secondIndex < root.items.length; secondIndex++) {
        const second = root.items[secondIndex]
        if (itemMatchesPath(second, pathname)) {
          return {
            rootKey: `${root.url}-${rootIndex}`,
            secondKey: `${second.url}-${secondIndex}`,
          }
        }
      }
    }
    return null
  }

  // 初始化: 仅展开当前路径所在的「一级」下的某个二级(如果命中)
  const [openSecondKeyByRoot, setOpenSecondKeyByRoot] = useState<Record<string, string | null>>(
    () => {
      const match = findMatch()
      return match ? { [match.rootKey]: match.secondKey } : {}
    }
  )

  useEffect(() => {
    const match = findMatch()
    if (!match) return
    setOpenSecondKeyByRoot((prev) => {
      if (prev[match.rootKey] === match.secondKey) return prev
      return {
        ...prev,
        [match.rootKey]: match.secondKey,
      }
    })
  }, [pathname, doctree])

  const setOpenSecondKeyForRoot = (rootKey: string, secondKey: string | null) => {
    setOpenSecondKeyByRoot((prev) => {
      // 确保每个一级分组只保存一个二级 key, 用于确保每个一级分组只保存一个二级 key
      const newState = { ...prev }
      if (secondKey === null) {
        // 收起:清除该一级的二级展开状态
        delete newState[rootKey]
      } else {
        // 展开:只设置当前二级, 覆盖之前的
        newState[rootKey] = secondKey
      }
      return newState
    })
  }

  return { openSecondKeyByRoot, setOpenSecondKeyForRoot }
}

function RecursiveMenuItem({
  item,
  depth = 0,
  rootKey,
  itemId,
  openSecondKeyByRoot,
  setOpenSecondKeyForRoot,
}: {
  item: DocTreeItem
  depth?: number
  rootKey: string
  /** 当前项在兄弟中的唯一 id(url + 索引), 用于二级手风琴, 避免同 url 多节点同时展开 */
  itemId?: string
  openSecondKeyByRoot: Record<string, string | null>
  setOpenSecondKeyForRoot: (rootKey: string, secondKey: string | null) => void
}) {
  const pathname = usePathname()
  const hasChildren = item.items && item.items.length > 0
  const shouldBeOpen = itemMatchesPath(item, pathname)

  const isSecondLevel = depth === 1
  const [openLocal, setOpenLocal] = useState(false)

  useEffect(() => {
    if (!isSecondLevel && shouldBeOpen) {
      setOpenLocal(true)
    }
  }, [pathname, shouldBeOpen, isSecondLevel])

  // 二级项：用手风琴状态里的唯一 itemId 比较, 只展开一个
  const open = isSecondLevel
    ? (openSecondKeyByRoot[rootKey] ?? null) === (itemId ?? item.url)
    : openLocal

  const handleOpenChange = (next: boolean) => {
    if (isSecondLevel) {
      const id = itemId ?? item.url
      if (next) {
        if ((openSecondKeyByRoot[rootKey] ?? null) !== id) {
          setOpenSecondKeyForRoot(rootKey, id)
        }
      } else {
        if ((openSecondKeyByRoot[rootKey] ?? null) === id) {
          setOpenSecondKeyForRoot(rootKey, null)
        }
      }
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
    <Collapsible 
      asChild 
      open={open} 
      onOpenChange={(next) => {
        // 防止事件冒泡, 确保只处理当前项
        handleOpenChange(next)
      }}
    >
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
            onClick={(e) => {
              // 阻止事件冒泡, 确保点击事件只在当前项处理
              if (isSecondLevel) {
                e.stopPropagation()
              }
            }}
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
            {item.items?.map((child: DocTreeItem, index: number) => (
              <RecursiveMenuItem
                key={`${child.url}-${index}`}
                item={child}
                depth={depth + 1}
                rootKey={rootKey}
                itemId={`${child.url}-${index}`}
                openSecondKeyByRoot={openSecondKeyByRoot}
                setOpenSecondKeyForRoot={setOpenSecondKeyForRoot}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function NavMain({ doctree }: { doctree: DocTreeItem[] }) {
  const { openSecondKeyByRoot, setOpenSecondKeyForRoot } = useSecondLevelAccordionByRoot(doctree)

  return (
    <SidebarGroup>
      <SidebarMenu className="mt-8 gap-1.5">
        {doctree.map((item, index) => (
          <RecursiveMenuItem
            key={`${item.url}-${index}`}
            item={item}
            depth={0}
            rootKey={`${item.url}-${index}`}
            openSecondKeyByRoot={openSecondKeyByRoot}
            setOpenSecondKeyForRoot={setOpenSecondKeyForRoot}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
