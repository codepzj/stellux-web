'use client'

import { SearchLinearIcon } from '@/components/SvgIcon'
import { useEffect } from 'react'
import { useSearch } from './provider'
import { cn } from '@/lib/utils'

type SearchProps = React.HTMLAttributes<HTMLButtonElement> & {
  placeholder?: string
}

export const Search = ({
  className,
  placeholder = 'search...',
  children,
  ...props
}: SearchProps) => {
  const { openSearch } = useSearch()
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.userAgent.includes('Mac')
      const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey
      if (isCtrlOrCmd && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
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
        'relative flex h-10 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm text-accent-foreground shadow-xs transition-colors',
        'hover:bg-accent',
        'dark:border-input',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      <SearchLinearIcon size={18} className="text-muted-foreground shrink-0" />
      <span className="min-w-0 flex-1 truncate text-left">
        {typeof children === 'string'
          ? children.replace(/ctrl\s*\+?\s*k/gi, '').trim() || placeholder
          : children || placeholder}
      </span>
    </button>
  )
}
