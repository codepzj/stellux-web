import { ContentListSkeleton } from '@/shared/components/ContentList/list-skeleton'
import { BLOG_PAGE_SIZE } from '@/shared/lib/blog-list'

export function BlogListSkeleton({ count = BLOG_PAGE_SIZE }: { count?: number }) {
  return <ContentListSkeleton count={count} />
}
