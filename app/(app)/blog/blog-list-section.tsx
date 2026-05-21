import Link from 'next/link'
import { Tag, FolderOpen, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import type { PostVO } from '@/types/post'
import type { BlogListPagination } from '@/lib/blog-list'
import {
  buildBlogListQuery,
  getPaginationWindow,
  paginationFilters,
} from '@/lib/blog-list'
import { BlogPostCard } from './blog-post-card'
import { BlogListHeader } from '@/components/Blog/blog-list-header'
import { BlogListShell } from '@/components/Blog/blog-list-shell'

type BlogListSectionProps = {
  posts: PostVO[]
  pagination: BlogListPagination
  tagName: string
  categoryName: string
}

export function BlogListSection({
  posts,
  pagination,
  tagName,
  categoryName,
}: BlogListSectionProps) {
  const { tag: navTag, category: navCategory } = paginationFilters(tagName, categoryName)
  const pageItems = getPaginationWindow(pagination.total_page, pagination.page_no)
  const hasFilter = Boolean(tagName || categoryName)
  const prevPage = pagination.page_no > 1 ? pagination.page_no - 1 : null
  const nextPage =
    pagination.page_no < pagination.total_page ? pagination.page_no + 1 : null

  return (
    <BlogListShell>
      <BlogListHeader totalCount={pagination.total_count} />

      {hasFilter && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">当前筛选</span>
          {categoryName && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-sm text-foreground">
              <FolderOpen className="size-3.5 text-muted-foreground" aria-hidden />
              {categoryName}
            </span>
          )}
          {tagName && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-sm text-foreground">
              <Tag className="size-3.5 text-muted-foreground" aria-hidden />
              {tagName}
            </span>
          )}
          <Link
            href="/blog"
            scroll
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'h-8 gap-1 rounded-full px-2.5 text-muted-foreground'
            )}
            aria-label="清除筛选"
          >
            <X className="size-3.5" aria-hidden />
            清除
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {posts.map((post, index) => (
          <BlogPostCard key={post.id} post={post} thumbnailPriority={index === 0} />
        ))}
      </div>

      {pagination.total_page > 1 && (
        <Pagination className="justify-center pt-2 md:justify-end">
          <PaginationContent>
            {prevPage && (
              <PaginationItem>
                <Link
                  href={`/blog?${buildBlogListQuery(prevPage, navTag, navCategory)}`}
                  scroll
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1')}
                  aria-label="上一页"
                >
                  <ChevronLeft className="size-4" aria-hidden />
                  <span className="hidden sm:inline">上一页</span>
                </Link>
              </PaginationItem>
            )}
            {pageItems.map((page) => (
              <PaginationItem key={page}>
                <Link
                  href={`/blog?${buildBlogListQuery(page, navTag, navCategory)}`}
                  scroll
                  className={cn(
                    buttonVariants({
                      variant: page === pagination.page_no ? 'outline' : 'ghost',
                      size: 'icon',
                    })
                  )}
                  aria-current={page === pagination.page_no ? 'page' : undefined}
                >
                  {page}
                </Link>
              </PaginationItem>
            ))}
            {nextPage && (
              <PaginationItem>
                <Link
                  href={`/blog?${buildBlogListQuery(nextPage, navTag, navCategory)}`}
                  scroll
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1')}
                  aria-label="下一页"
                >
                  <span className="hidden sm:inline">下一页</span>
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </BlogListShell>
  )
}
