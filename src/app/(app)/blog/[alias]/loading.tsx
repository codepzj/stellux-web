import { MdPageSkeleton } from '@/shared/components/Md'
import { BlogArticleShell } from '@/features/blog/components/blog-article-shell'
import { BLOG_CONTENT_MAX_CLASS } from '@/shared/lib/blog-layout'
import { cn } from '@/shared/lib/utils'

export default function BlogPostLoading() {
  return (
    <BlogArticleShell>
      <div className={cn('mx-auto w-full', BLOG_CONTENT_MAX_CLASS)}>
        <MdPageSkeleton />
      </div>
    </BlogArticleShell>
  )
}
