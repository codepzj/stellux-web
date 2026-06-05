import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Clock, Pencil, Pilcrow, Timer } from 'lucide-react'

/**
 * 博客/文档等 MD 页面的统一骨架屏
 * 结构与实际 Markdown 内容呈现一致：标题、元信息、markdown-body 段落/标题/代码块
 * @param contentClassName - 可选，文档页传 pl-2 以与 Markdown 组件对齐
 */
export function MdPageSkeleton({ contentClassName }: { contentClassName?: string }) {
  return (
    <div>
      {/* 与博客文章页 PostArticleHeader 一致的圆角信息区 */}
      <div className="mb-10 rounded-2xl border border-zinc-200/70 bg-zinc-100 px-5 py-5 dark:border-border/80 dark:bg-muted/45 md:px-6 md:py-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-x-5">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Pencil className="size-3.5 shrink-0 opacity-80" />
            <Skeleton className="h-3.5 w-14 rounded" />
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-3.5 shrink-0 opacity-80" />
            <Skeleton className="h-3.5 w-14 rounded" />
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Timer className="size-3.5 shrink-0 opacity-80" />
            <Skeleton className="h-3.5 w-16 rounded" />
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Pilcrow className="size-3.5 shrink-0 opacity-80" />
            <Skeleton className="h-3.5 w-16 rounded" />
          </div>
        </div>
        <Skeleton className="mt-5 h-8 w-[min(100%,28rem)] rounded-md md:h-9" />
      </div>
      <div className="mb-10 flex gap-2.5">
        <span className="mt-0.5 text-primary/40" aria-hidden>
          ✧
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-full max-w-2xl rounded" />
          <Skeleton className="h-4 w-4/5 max-w-xl rounded" />
        </div>
      </div>

      {/* Markdown 内容区 - 与 markdown-body 一致，段落间距稍大以匹配实际呈现 */}
      <article className={cn('markdown-body text-base', contentClassName)}>
        {/* 段落 - p: margin 0.8em 0 1em，line-height 1.85 行高约 31px */}
        <div className="my-5 space-y-3">
          <Skeleton className="h-8 w-full rounded" />
          <Skeleton className="h-8 w-full rounded" />
          <Skeleton className="h-8 w-5/6 rounded" />
        </div>

        {/* 段落 */}
        <div className="my-5 space-y-3">
          <Skeleton className="h-8 w-full rounded" />
          <Skeleton className="h-8 w-4/5 rounded" />
        </div>

        {/* 二级标题 - h2: my-10 pb-3 border-b */}
        <div className="my-10 border-b border-gray-200 dark:border-gray-700 pb-3">
          <Skeleton className="h-9 w-64 rounded" />
        </div>

        {/* 段落 */}
        <div className="my-5 space-y-3">
          <Skeleton className="h-8 w-full rounded" />
          <Skeleton className="h-8 w-3/4 rounded" />
        </div>

        {/* 代码块 - pre my-6 */}
        <div className="my-6 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-700/60 overflow-hidden">
          <div className="overflow-x-auto p-4 space-y-3">
            <Skeleton className="h-5 w-full rounded" />
            <Skeleton className="h-5 w-[92%] rounded" />
            <Skeleton className="h-5 w-4/5 rounded" />
            <Skeleton className="h-5 w-2/3 rounded" />
          </div>
        </div>

        {/* 三级标题 - h3: my-8 */}
        <div className="my-8">
          <Skeleton className="h-7 w-56 rounded" />
        </div>

        {/* 段落 */}
        <div className="my-5 space-y-3">
          <Skeleton className="h-8 w-full rounded" />
          <Skeleton className="h-8 w-full rounded" />
          <Skeleton className="h-8 w-2/3 rounded" />
        </div>

        {/* 四级标题 - h4: my-6 */}
        <div className="my-6">
          <Skeleton className="h-6 w-48 rounded" />
        </div>

        {/* 列表 - ul mt-4, li my-2 */}
        <div className="mt-5 pl-5 space-y-3">
          <Skeleton className="h-8 w-full rounded" />
          <Skeleton className="h-8 w-5/6 rounded" />
          <Skeleton className="h-8 w-4/5 rounded" />
        </div>
      </article>
    </div>
  )
}
