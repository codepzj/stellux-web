import Link from 'next/link'
import type { PostVO } from '@/entities/post/types'
import { Clock, Leaf, Pencil, Pilcrow, Tag, Timer } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { buildBlogListQuery } from '@/shared/lib/blog-list'
import {
  formatBlogHeaderDate,
  estimateMarkdownCharCount,
  estimateReadingMinutes,
} from '@/shared/lib/post-reading'
import { Badge } from '@/shared/ui/badge'

type Props = {
  post: PostVO
  className?: string
}

export function PostArticleHeader({ post, className }: Props) {
  const charCount = estimateMarkdownCharCount(post.content)
  const readingMinutes = estimateReadingMinutes(post.content)
  const hasCategory = Boolean(post.category?.trim())
  const tags = post.tags?.filter(Boolean) ?? []

  return (
    <header className={cn('mb-10 md:mb-12', className)}>
      <div className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-5 md:px-6 md:py-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground md:text-[13px]">
          <span
            className="inline-flex items-center gap-1.5"
            title={`创建于 ${formatBlogHeaderDate(post.created_at)}`}
          >
            <Pencil className="size-3.5 shrink-0 opacity-80" aria-hidden />
            <span className="tabular-nums">{formatBlogHeaderDate(post.created_at)}</span>
          </span>
          <span
            className="inline-flex items-center gap-1.5"
            title={`更新于 ${formatBlogHeaderDate(post.updated_at)}`}
          >
            <Clock className="size-3.5 shrink-0 opacity-80" aria-hidden />
            <span className="tabular-nums">{formatBlogHeaderDate(post.updated_at)}</span>
          </span>
          {hasCategory && (
            <Link
              href={`/blog?${buildBlogListQuery(1, undefined, post.category)}`}
              scroll
              className="inline-flex items-center gap-1.5 rounded-md transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title="查看同分类文章"
            >
              <Leaf className="size-3.5 shrink-0 opacity-80" aria-hidden />
              <span>{post.category}</span>
            </Link>
          )}
          {readingMinutes > 0 && (
            <span className="inline-flex items-center gap-1.5" title="预计阅读时长">
              <Timer className="size-3.5 shrink-0 opacity-80" aria-hidden />
              <span className="tabular-nums">约 {readingMinutes} 分钟</span>
            </span>
          )}
          {charCount > 0 && (
            <span className="inline-flex items-center gap-1.5" title="正文字数（估算）">
              <Pilcrow className="size-3.5 shrink-0 opacity-80" aria-hidden />
              <span className="tabular-nums">{charCount} 字</span>
            </span>
          )}
        </div>
        <h1 className="mt-4 text-balance py-1 text-left font-serif text-3xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag} href={`/blog?${buildBlogListQuery(1, tag, undefined)}`} scroll>
                <Badge variant="outline" labelRole="tag" className="cursor-pointer">
                  <Tag className="size-3" aria-hidden />
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
