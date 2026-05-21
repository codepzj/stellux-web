import { MdPageSkeleton } from '@/components/Md'
import { BlogArticleShell } from '@/components/Blog/blog-article-shell'
import { BLOG_CONTENT_MAX_CLASS } from '@/lib/blog-layout'
import { cn } from '@/lib/utils'

export default function BlogPostLoading() {
  return (
    <BlogArticleShell>
      <div className={cn('mx-auto w-full', BLOG_CONTENT_MAX_CLASS)}>
        <MdPageSkeleton />
      </div>
    </BlogArticleShell>
  )
}
