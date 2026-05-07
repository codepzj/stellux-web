'use client'

import { Search as SearchIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useSearch } from './provider'
import { cn } from '@/lib/utils'

type SearchProps = React.HTMLAttributes<HTMLButtonElement> & {
  placeholder?: string
}

export const Search = ({
  className,
  placeholder = '搜索文章…',
  children,
  ...props
}: SearchProps) => {
  const { openSearch } = useSearch()
  const [modLabel, setModLabel] = useState('⌘')

  useEffect(() => {
    const isMac = /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent)
    setModLabel(isMac ? '⌘' : 'Ctrl')
  }, [])

  const onKeyGlobal = useCallback(
    (e: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent)
      const mod = isMac ? e.metaKey : e.ctrlKey
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        openSearch()
      }
    },
    [openSearch]
  )

  useEffect(() => {
    window.addEventListener('keydown', onKeyGlobal)
    return () => window.removeEventListener('keydown', onKeyGlobal)
  }, [onKeyGlobal])

  return (
    <button
      type="button"
      {...props}
      onClick={(event) => {
        props.onClick?.(event)
        if (!event.defaultPrevented) {
          openSearch()
        }
      }}
      className={cn(
        'group relative flex h-10 w-full cursor-pointer items-center gap-2.5 overflow-hidden rounded-xl border border-border/80 bg-muted/30 px-3 text-sm text-muted-foreground shadow-sm transition-colors',
        'hover:border-border hover:bg-muted/50 hover:text-foreground',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
        'dark:border-border/60 dark:bg-muted/20 dark:hover:bg-muted/35',
        className
      )}
    >
      <SearchIcon
        className="size-4 shrink-0 opacity-60 transition-opacity group-hover:opacity-90"
        aria-hidden
      />
      <span className="min-w-0 flex-1 truncate text-left font-medium text-foreground/80 group-hover:text-foreground">
        {children ?? placeholder}
      </span>
      <span className="pointer-events-none hidden shrink-0 items-center gap-0.5 sm:inline-flex">
        <kbd className="rounded-md border border-border/80 bg-background px-1.5 py-px font-mono text-[10px] font-medium text-muted-foreground shadow-sm">
          {modLabel}
        </kbd>
        <kbd className="rounded-md border border-border/80 bg-background px-1.5 py-px font-mono text-[10px] font-medium text-muted-foreground shadow-sm">
          K
        </kbd>
      </span>
    </button>
  )
}
