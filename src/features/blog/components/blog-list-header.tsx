import { BookOpen } from 'lucide-react'
import { Search } from '@/features/blog/components/search-trigger'
import { cn } from '@/shared/lib/utils'

type BlogListHeaderProps = {
  totalCount: number | '…'
  className?: string
}

export function BlogListHeader({ totalCount, className }: BlogListHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b border-border/60 pb-6 md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Journal
        </p>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            博客
          </h1>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <BookOpen className="size-3.5 opacity-70" aria-hidden />
            <span className="tabular-nums">{totalCount === '…' ? '…' : `${totalCount} 篇`}</span>
          </span>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          技术笔记与思考碎片，可按分类与标签筛选浏览。
        </p>
      </div>
      <Search className="w-full md:w-56 lg:w-64" />
    </div>
  )
}
