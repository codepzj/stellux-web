import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Calendar, Clock, BookOpen } from 'lucide-react'

/**
 * 博客/文档等 MD 页面的统一骨架屏
 * 结构与实际 Markdown 内容呈现一致：标题、元信息、markdown-body 段落/标题/代码块
 * @param contentClassName - 可选，文档页传 pl-2 以与 Markdown 组件对齐
 */
export function MdPageSkeleton({ contentClassName }: { contentClassName?: string }) {
  return (
    <div>
      {/* 标题 - 与 text-3xl font-bold py-4 mb-4 对应，增加上下间距 */}
      <div className="py-4 mb-4">
        <Skeleton className="h-9 w-4/5 max-w-2xl rounded-md" />
      </div>

      {/* 元信息 - 与文章页/文档页一致 */}
      <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-8 px-2">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 md:h-4 md:w-4 text-gray-500 dark:text-gray-400 shrink-0" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 md:h-4 md:w-4 text-gray-500 dark:text-gray-400 shrink-0" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="h-3 w-3 md:h-4 md:w-4 text-gray-500 dark:text-gray-400 shrink-0" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="h-4" />

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
