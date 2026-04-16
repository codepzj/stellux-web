'use client'

import Link from 'next/link'
import { ChevronRight, List } from 'lucide-react'
import type { DocTreeItem } from '@/utils/document-tree'
import { usePathname } from 'next/navigation'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

function itemMatchesPath(item: DocTreeItem, pathname: string): boolean {
  if (item.url === pathname) return true
  if (item.items) {
    return item.items.some((child: DocTreeItem) => itemMatchesPath(child, pathname))
  }
  return false
}

function TreeChevronCell({ children }: { children?: React.ReactNode }) {
  return (
    <span className="flex h-4 w-[15px] shrink-0 items-center justify-center text-sidebar-foreground/55">
      {children}
    </span>
  )
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
  itemId?: string
  openSecondKeyByRoot: Record<string, string | null>
  setOpenSecondKeyForRoot: (rootKey: string, secondKey: string | null) => void
}) {
  const pathname = usePathname()
  const hasChildren = item.items && item.items.length > 0
  const shouldBeOpen = itemMatchesPath(item, pathname)

  const isSecondLevel = depth === 1
  const [openLocal, setOpenLocal] = useState(depth === 0)

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
              'flex w-full min-w-0 items-center gap-1.5 rounded-md',
              'transition-all duration-200 ease-in-out',
              'hover:bg-primary/10! hover:dark:bg-primary/20!',
              pathname === item.url &&
                'bg-primary/10! font-semibold dark:bg-primary/20! dark:font-semibold'
            )}
          >
            <TreeChevronCell />
            <span className="min-w-0 flex-1 truncate transition-all duration-200">{item.title}</span>
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
            className={cn(
              'flex w-full min-w-0 items-center gap-1.5 rounded-md',
              'font-normal transition-all duration-200 ease-in-out',
              'hover:bg-primary/10 dark:hover:bg-primary/20',
              pathname === item.url && 'bg-primary/10 font-semibold dark:bg-primary/20 dark:font-semibold'
            )}
            onClick={(e) => {
              // 阻止事件冒泡, 确保点击事件只在当前项处理
              if (isSecondLevel) {
                e.stopPropagation()
              }
            }}
          >
            <TreeChevronCell>
              <ChevronRight
                className={cn(
                  'size-3.5 shrink-0 transition-transform duration-200 ease-out',
                  open && 'rotate-90'
                )}
                aria-hidden
              />
            </TreeChevronCell>
            <span className="min-w-0 flex-1 truncate transition-all duration-200">{item.title}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden transition-[height,opacity] duration-200 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:duration-150 data-[state=open]:duration-200">
          <SidebarMenuSub className="mx-0 translate-x-0 border-l border-sidebar-border/50 py-0.5 pl-2.5">
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
  const pathname = usePathname()
  const { openSecondKeyByRoot, setOpenSecondKeyForRoot } = useSecondLevelAccordionByRoot(doctree)
  const [, documentBase, rootAlias] = pathname.split('/')
  const rootDocumentUrl =
    documentBase === 'document' && rootAlias ? `/document/${rootAlias}` : '/document'

  return (
    <SidebarGroup className="gap-1">
      <SidebarGroupLabel className="h-9 px-2 text-sm font-semibold text-sidebar-foreground">
        <Link
          href={rootDocumentUrl}
          className="flex h-full w-full min-w-0 items-center gap-1.5 rounded-md pr-1.5 transition-colors hover:bg-primary/10 hover:text-foreground"
        >
          <TreeChevronCell>
            <List className="size-3.5" aria-hidden />
          </TreeChevronCell>
          <span className="min-w-0 flex-1 truncate">目录</span>
        </Link>
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1.5">
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
