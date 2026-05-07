// @ts-nocheck
'use client'

import * as React from 'react'
import { useEffect, useState, useMemo } from 'react'
import { getTableOfContents, TableOfContents } from './content'
import { cn } from '@/lib/utils'
import { ChevronDown, List } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TocProps {
  content: string
  className?: string
}

export const ScrollToc = ({ content, className }: TocProps) => {
  return (
    <div className="w-full min-w-48 min-h-0">
      <Toc content={content} className={className} />
    </div>
  )
}

export function Toc({ content, className }: TocProps) {
  const [toc, setToc] = useState<TableOfContents | null>(null)
  useEffect(() => {
    const fetchToc = async () => {
      const toc = await getTableOfContents(content)
      setToc(toc)
    }
    fetchToc()
  }, [content])

  const itemIds = useMemo(
    () =>
      toc
        ? toc?.flatMap((item) => [
            item.url?.replace(/^#/, ''),
            ...(item.items?.map((subItem) => subItem.url?.replace(/^#/, '')) || []),
          ])
        : [],
    [toc]
  )

  const activeId = useActiveItem(itemIds)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (!activeId) return
    const tocItem = document.querySelector(`[data-toc-id="${activeId}"]`)
    if (tocItem) {
      tocItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeId])

  if (!toc?.length) return null

  return (
    <nav className={cn('text-sm transition-all duration-300 z-50', className)}>
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="flex justify-between items-center mb-3 px-2 cursor-pointer select-none"
      >
        <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm font-semibold tracking-wide text-muted-foreground dark:text-zinc-200 sticky top-0 right-0">
          <List className="size-3.5 shrink-0 opacity-90 dark:opacity-100" aria-hidden />
          <span className="truncate">大纲</span>
        </div>
        <button
          type="button"
          className="transition-transform duration-300 text-muted-foreground hover:text-foreground dark:text-zinc-300 dark:hover:text-zinc-100"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronDown
            className={cn(
              'w-5 h-5 transform transition-transform',
              collapsed ? '-rotate-90' : 'rotate-0'
            )}
          />
        </button>
      </div>
      <ScrollArea
        className={cn(
          'transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden pr-2',
          collapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'
        )}
      >
        <Tree tree={toc} activeItem={activeId} />
      </ScrollArea>
    </nav>
  )
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!itemIds.length) return

    const handleScroll = () => {
      let current: string | null = null
      for (const id of itemIds) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100) {
            current = id
          }
        }
      }
      setActiveId(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [itemIds])

  return activeId
}

interface TreeProps {
  tree: TableOfContents
  level?: number
  activeItem?: string | null
}

function Tree({ tree, level = 1, activeItem }: TreeProps) {
  return (
    <ul
      className={cn(
        'space-y-[2px] pl-2',
        level === 1 && 'border-l border-zinc-200 dark:border-zinc-500/80'
      )}
    >
      {tree.map((item, index) => {
        const itemId = item.url?.replace(/^#/, '')
        const isActive = itemId === activeItem

        return (
          <li key={index} className="relative">
            <a
              href={item.url}
              data-toc-id={itemId}
              className={cn(
                'block px-1.5 py-[3px] rounded-sm font-normal transition-all duration-200 transform-gpu',
                'text-primary hover:bg-primary/10 hover:text-foreground hover:scale-[1.01]',
                'dark:text-zinc-100 dark:hover:text-white',
                isActive && 'bg-primary/10 font-semibold scale-[1.02] pl-3 dark:bg-primary/15'
              )}
              style={{ transformOrigin: 'left center' }}
            >
              {isActive && (
                <span className="absolute left-1 top-1/2 -translate-y-1/2 w-[4px] h-[14px] bg-primary rounded-full shadow-sm" />
              )}
              <span
                className={cn(
                  level === 1 ? 'text-[13px] md:text-[14px]' : 'text-[13px]',
                  isActive ? 'text-primary dark:text-zinc-50' : 'font-normal'
                )}
              >
                {item.title}
              </span>
            </a>
            {item.items?.length > 0 && (
              <div className="pl-2">
                <Tree tree={item.items} level={level + 1} activeItem={activeItem} />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
