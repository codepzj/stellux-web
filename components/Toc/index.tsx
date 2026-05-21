// @ts-nocheck
'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { useEffect, useState, useMemo } from 'react'
import { getTableOfContents, TableOfContents } from './content'
import { hasTocHeadings } from '@/lib/markdown-toc'
import { cn } from '@/lib/utils'
import { ChevronDown, List, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

interface TocProps {
  content: string
  className?: string
  /** sidebar：目录轨样式；floating：右下角浮层内（无标题）；inline：文内折叠块 */
  variant?: 'inline' | 'sidebar' | 'floating'
}

type FloatingTocProps = {
  content: string
  /** 与侧边栏折叠按钮同屏时抬高，避免重叠 */
  className?: string
}

export function FloatingToc({ content, className }: FloatingTocProps) {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [show, setShow] = React.useState(() => hasTocHeadings(content))

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!content?.trim()) {
      setShow(false)
      return
    }
    setShow(hasTocHeadings(content))
    let cancelled = false
    getTableOfContents(content).then((items) => {
      if (!cancelled) {
        setShow(Boolean(items?.length) || hasTocHeadings(content))
      }
    })
    return () => {
      cancelled = true
    }
  }, [content])

  if (!mounted || !show) return null

  return createPortal(
    <div
      className={cn(
        'pointer-events-none fixed bottom-20 right-6 z-60 flex max-w-[calc(100vw-3rem)] flex-col-reverse items-end gap-2',
        className
      )}
    >
      <Button
        type="button"
        size="icon"
        variant="outline"
        aria-expanded={open}
        aria-controls="floating-toc-panel"
        aria-label={open ? '关闭目录' : '打开文章目录'}
        className={cn(
          'pointer-events-auto size-9 rounded-full border-border/80 bg-background/90 shadow-md backdrop-blur-sm',
          'hover:bg-background'
        )}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <X className="size-4" aria-hidden />
        ) : (
          <List className="size-4" aria-hidden />
        )}
      </Button>

      {open && (
        <div
          id="floating-toc-panel"
          role="dialog"
          aria-label="文章目录"
          className={cn(
            'pointer-events-auto w-72 origin-bottom-right rounded-xl border border-border/70 bg-background/95 p-3 shadow-lg backdrop-blur-md',
            'max-h-[min(50vh,22rem)] overflow-y-auto overscroll-contain'
          )}
        >
          <Toc content={content} variant="floating" />
        </div>
      )}
    </div>,
    document.body
  )
}

export const ScrollToc = ({ content, className }: TocProps) => {
  return (
    <div className="w-full min-w-48 min-h-0">
      <Toc content={content} className={className} />
    </div>
  )
}

export function Toc({ content, className, variant = 'inline' }: TocProps) {
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

  const isRail = variant === 'sidebar' || variant === 'floating'

  return (
    <nav className={cn('text-xs', className)} aria-label="文章目录">
      {variant === 'sidebar' ? (
        <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
          目录
        </p>
      ) : variant === 'floating' ? null : (
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="mb-3 flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-1 py-0.5 text-left select-none transition-colors hover:bg-muted/50"
          aria-expanded={!collapsed}
        >
          <span className="flex min-w-0 flex-1 items-center gap-1.5 text-xs font-semibold tracking-wide text-foreground">
            <List className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="truncate">目录</span>
          </span>
          <ChevronDown
            className={cn(
              'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
              collapsed ? '-rotate-90' : 'rotate-0'
            )}
            aria-hidden
          />
        </button>
      )}
      {isRail ? (
        <Tree
          tree={toc}
          activeItem={activeId}
          variant={variant === 'floating' ? 'floating' : 'sidebar'}
        />
      ) : (
        <ScrollArea
          className={cn(
            'pr-2 transition-[max-height,opacity] duration-300 ease-in-out',
            collapsed ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-[min(420px,50vh)] opacity-100'
          )}
        >
          <Tree tree={toc} activeItem={activeId} variant="inline" />
        </ScrollArea>
      )}
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
  variant?: 'inline' | 'sidebar' | 'floating'
}

function Tree({ tree, level = 1, activeItem, variant = 'inline' }: TreeProps) {
  const isFloating = variant === 'floating'
  const isSidebar = variant === 'sidebar'

  return (
    <ul
      className={cn(
        'space-y-0.5',
        level === 1 &&
          !isFloating &&
          (isSidebar
            ? 'border-l border-border/40 pl-0'
            : 'border-l border-border/60 pl-2')
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
                'block py-1 font-normal transition-colors duration-150',
                isFloating &&
                  cn(
                    'px-1 text-[13px] leading-snug text-muted-foreground hover:text-foreground',
                    isActive && 'font-medium text-foreground'
                  ),
                isSidebar &&
                  cn(
                    'border-l-2 border-transparent pl-3 pr-1 text-[13px] leading-snug text-muted-foreground',
                    'hover:border-border/60 hover:text-foreground',
                    isActive && 'border-foreground/35 font-medium text-foreground'
                  ),
                !isFloating &&
                  !isSidebar &&
                  cn(
                    'rounded-md px-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                    isActive && 'bg-muted/60 pl-2.5 font-medium text-foreground'
                  )
              )}
            >
              {!isFloating && !isSidebar && isActive && (
                <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-foreground/40" />
              )}
              {!isFloating && !isSidebar ? (
                <span
                  className={cn(
                    level === 1 ? 'text-[12px] md:text-[13px]' : 'text-[11px]',
                    isActive && 'text-foreground'
                  )}
                >
                  {item.title}
                </span>
              ) : (
                item.title
              )}
            </a>
            {item.items?.length > 0 && (
              <div className={cn(isFloating || isSidebar ? 'pl-2.5' : 'pl-2')}>
                <Tree
                  tree={item.items}
                  level={level + 1}
                  activeItem={activeItem}
                  variant={variant}
                />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
