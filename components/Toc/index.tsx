// @ts-nocheck
'use client'

import * as React from 'react'
import { useEffect, useState, useMemo } from 'react'
import { getTableOfContents, TableOfContents } from './content'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TocProps {
  content: string
  className?: string
}

export const ScrollToc = ({ content, className }: TocProps) => {
  return (
    <div className="w-48">
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
        <div className="text-muted-foreground dark:text-zinc-400 font-medium tracking-wide sticky top-0 right-0">
          目录
        </div>
        <button
          className="transition-transform duration-300 text-muted-foreground hover:text-foreground"
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
        level === 1 && 'border-l border-zinc-200 dark:border-zinc-700'
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
                'block px-1.5 py-[3px] rounded-sm transition-all duration-200 transform-gpu',
                'hover:bg-accent/30 hover:text-foreground hover:scale-[1.01]',
                'dark:hover:bg-white/10 dark:text-zinc-400 dark:hover:text-white',
                isActive
                  ? 'bg-primary/10 text-primary font-medium scale-[1.02] pl-3'
                  : 'text-muted-foreground'
              )}
              style={{ transformOrigin: 'left center' }}
            >
              {isActive && (
                <span className="absolute left-1 top-1/2 -translate-y-1/2 w-[4px] h-[14px] bg-primary rounded-full shadow-sm" />
              )}
              <span
                className={cn(
                  level === 1 ? 'font-medium text-[13px]' : 'text-[12px]',
                  isActive && 'text-primary'
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
