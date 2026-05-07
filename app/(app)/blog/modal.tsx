'use client'

import { useRouter } from 'next/navigation'
import { FileText, FileQuestion, Loader2, Search } from 'lucide-react'
import { useSearch } from '@/app/(app)/blog/provider'
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

function highlight(text: string, key: string) {
  if (!key.trim()) return text
  const parts = text.split(new RegExp(`(${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return parts.map((p, i) =>
    p.toLowerCase() === key.toLowerCase() ? (
      <mark
        key={i}
        className="rounded-sm bg-primary/15 px-0.5 text-foreground dark:bg-primary/25"
      >
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    )
  )
}

export function SearchModal() {
  const router = useRouter()
  const { isOpen, closeSearch, keyword, setKeyword, results, loading, hasSearched } = useSearch()

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeSearch()
      }}
      title="搜索文章"
      description="输入关键词搜索博客标题与摘要"
      showCloseButton={false}
      className="top-[12%] max-h-[min(85vh,720px)] w-[calc(100%-1.5rem)] translate-y-0 sm:max-w-xl"
    >
      <Command shouldFilter={false} className="rounded-lg">
        <CommandInput
          value={keyword}
          onValueChange={setKeyword}
          placeholder="输入关键词…"
          className="text-base"
        />
        {(loading || (keyword.trim().length > 0 && hasSearched)) && (
          <div className="flex min-h-9 items-center gap-2 border-b border-border/60 bg-muted/15 px-3 py-2 text-xs text-muted-foreground">
            {loading ? (
              <>
                <Loader2 className="size-3.5 shrink-0 animate-spin opacity-70" aria-hidden />
                <span>正在搜索…</span>
              </>
            ) : (
              <span>
                找到{' '}
                <span className="font-semibold tabular-nums text-foreground">{results.length}</span>{' '}
                篇相关文章
              </span>
            )}
          </div>
        )}
        <CommandList
          className={cn(
            'max-h-[min(52vh,420px)] scroll-py-2',
            (loading || !keyword.trim()) && 'min-h-56'
          )}
        >
          {!loading && results.length > 0 && (
            <CommandGroup heading="文章" className="p-2">
              {results.map((post) => (
                <CommandItem
                  key={post.id}
                  value={`${post.id}-${post.alias}`}
                  onSelect={() => {
                    router.push(`/blog/${post.alias}`)
                    closeSearch()
                  }}
                  className={cn(
                    'mb-1 cursor-pointer gap-3 rounded-lg border border-transparent px-3 py-3 last:mb-0',
                    'data-[selected=true]:border-border data-[selected=true]:bg-muted/60 data-[selected=true]:shadow-sm'
                  )}
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground opacity-80" aria-hidden />
                  <div className="min-w-0 flex-1 text-left">
                    <div className="line-clamp-2 font-medium leading-snug text-foreground">
                      {keyword.trim() ? highlight(post.title, keyword) : post.title}
                    </div>
                    {post.description ? (
                      <div className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {keyword.trim() ? highlight(post.description, keyword) : post.description}
                      </div>
                    ) : null}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!loading && hasSearched && keyword.trim().length > 0 && results.length === 0 && (
            <div
              className="flex flex-col items-center justify-center px-6 py-14 text-center"
              role="status"
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-muted/30 shadow-sm">
                <FileQuestion className="size-5 text-muted-foreground" strokeWidth={1.75} aria-hidden />
              </div>
              <p className="text-sm font-medium text-foreground">未找到匹配的文章</p>
              <p className="mt-2 max-w-68 text-xs leading-relaxed text-muted-foreground">
                没有找到与「<span className="font-medium text-foreground/90">{keyword.trim()}</span>
                」相关的内容，可换个说法或缩短关键词再试。
              </p>
            </div>
          )}

          {loading && (
            <div className="space-y-2 p-3" aria-busy="true" aria-label="加载结果">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-lg border border-border/50 bg-muted/30 p-4"
                >
                  <div className="h-4 w-[85%] max-w-md rounded bg-muted" />
                  <div className="mt-3 h-3 w-full rounded bg-muted/80" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-muted/80" />
                </div>
              ))}
            </div>
          )}

          {!loading && !keyword.trim() && (
            <div
              className="flex flex-col items-center justify-center px-5 py-12 text-center sm:px-8"
              role="status"
            >
              <div className="relative mb-5">
                <div
                  className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/8 via-transparent to-transparent blur-xl"
                  aria-hidden
                />
                <div className="relative flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-card shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                  <Search className="size-6 text-muted-foreground" strokeWidth={1.75} aria-hidden />
                </div>
              </div>
              <p className="text-[15px] font-semibold tracking-tight text-foreground">搜索博客</p>
              <p className="mt-2 max-w-[18rem] text-[13px] leading-relaxed text-muted-foreground">
                在搜索框键入词组，将按标题与摘要匹配；无需按回车，稍作等待即可列出结果。
              </p>
            </div>
          )}
        </CommandList>

        <CommandSeparator />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-muted/20 px-3 py-2.5 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="pointer-events-none rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium shadow-sm">
              ↑↓
            </kbd>
            选择
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="pointer-events-none rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium shadow-sm">
              ↵
            </kbd>
            打开
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="pointer-events-none rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium shadow-sm">
              esc
            </kbd>
            关闭
          </span>
        </div>
      </Command>
    </CommandDialog>
  )
}
