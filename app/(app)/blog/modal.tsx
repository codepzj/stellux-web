'use client'

import { useEffect, useRef } from 'react'
import NextLink from 'next/link'
import { createPortal } from 'react-dom'
import { SearchLinearIcon } from '@/components/SvgIcon'
import { useSearch } from '@/app/(app)/blog/provider'

export function SearchModal() {
  const { isOpen, closeSearch, keyword, setKeyword, results, loading, hasSearched } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeSearch])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const highlight = (text: string, key: string) => {
    const parts = text.split(new RegExp(`(${key})`, 'gi'))
    return parts.map((p, i) =>
      p.toLowerCase() === key.toLowerCase() ? (
        <mark key={i} className="bg-yellow-300 text-black px-1 rounded">
          {p}
        </mark>
      ) : (
        <span key={i}>{p}</span>
      )
    )
  }

  if (!isOpen) return null

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="search..."
    >
      {/* 遮罩：点击关闭 */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={closeSearch}
        aria-hidden="true"
      />

      {/* 弹窗面板 */}
      <div
        className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-lg border bg-background shadow-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 搜索输入区 */}
        <div className="sticky top-0 z-10 border-b bg-background/95 px-6 py-4 backdrop-blur supports-backdrop-filter:bg-background/75">
          <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-2 shadow-sm">
            <SearchLinearIcon size={20} className="text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="search"
              placeholder="search with keywords..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="h-8 flex-1 min-w-0 border-0 bg-transparent px-0 text-base text-foreground placeholder:text-muted-foreground outline-none focus:ring-0"
              aria-label="search keywords"
            />
            <kbd className="pointer-events-none shrink-0 rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground border">
              ESC
            </kbd>
          </div>
        </div>

        {/* 结果列表 */}
        <div className="max-h-[65vh] overflow-y-auto px-6 pb-6 pt-4 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-transparent bg-muted/40 p-4 animate-pulse"
                >
                  <div className="h-5 w-3/4 bg-muted rounded mb-2" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-2/3 bg-muted rounded mt-2" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            results.map((post) => (
              <NextLink className='block mb-2' key={post.id} href={`/blog/${post.alias}`} onClick={closeSearch}>
                <div className="cursor-pointer rounded-lg border border-transparent bg-muted/40 p-4 transition-all duration-200 hover:border-border hover:bg-muted hover:shadow-sm">
                  <div className="line-clamp-2 text-base font-medium text-foreground">
                    {keyword.trim() ? highlight(post.title, keyword) : post.title}
                  </div>
                  {post.description && (
                    <div className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {keyword.trim() ? highlight(post.description, keyword) : post.description}
                    </div>
                  )}
                </div>
              </NextLink>
            ))
          ) : (
            hasSearched &&
            keyword.trim() &&
            !loading &&
            results.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                no results
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : null
}
