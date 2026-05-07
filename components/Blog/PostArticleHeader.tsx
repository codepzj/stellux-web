import type { PostVO } from '@/types/post'
import { ArticleDescriptionTypewriter } from '@/components/Blog/ArticleDescriptionTypewriter'
import { Clock, Leaf, Pencil, Pilcrow } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatBlogHeaderDate, estimateMarkdownCharCount } from '@/lib/post-reading'

type Props = {
  post: PostVO
  className?: string
}

export function PostArticleHeader({ post, className }: Props) {
  const charCount = estimateMarkdownCharCount(post.content)
  const hasCategory = Boolean(post.category?.trim())

  return (
    <header className={cn('mb-12 md:mb-14', className)}>
      <div
        className={cn(
          'flex flex-col gap-4 rounded-2xl border border-zinc-200/70 bg-zinc-100 px-4 py-4 md:gap-4 md:px-5 md:py-4',
          'dark:border-border/80 dark:bg-muted/45'
        )}
      >
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
            <span className="inline-flex items-center gap-1.5" title="分类">
              <Leaf className="size-3.5 shrink-0 opacity-80" aria-hidden />
              <span>{post.category}</span>
            </span>
          )}
          {charCount > 0 && (
            <span className="inline-flex items-center gap-1.5" title="正文字数（估算）">
              <Pilcrow className="size-3.5 shrink-0 opacity-80" aria-hidden />
              <span className="tabular-nums">{charCount} 字</span>
            </span>
          )}
        </div>
        <h1 className="text-balance text-left font-serif text-[1.65rem] font-bold leading-snug tracking-tight text-foreground md:text-3xl md:leading-[1.2]">
          {post.title}
        </h1>
      </div>
      {post.description?.trim() ? (
        <ArticleDescriptionTypewriter text={post.description.trim()} />
      ) : null}
    </header>
  )
}
