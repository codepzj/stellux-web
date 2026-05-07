import Link from 'next/link'
import { Tag, Book, FolderOpen } from 'lucide-react'
import { Search } from './search'
import { cn } from '@/lib/utils'
import type { PostVO } from '@/types/post'
import type { BlogListPagination } from '@/lib/blog-list'
import {
  buildBlogListQuery,
  getPaginationWindow,
  paginationFilters,
} from '@/lib/blog-list'
import { BlogPostCard } from './blog-post-card'

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

  return (
    <div className="dark:bg-gray-950 min-h-screen">
      <div className="w-full">
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-24">
          <div className="max-w-5xl mx-auto space-y-12">
            <section className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Book className="w-6 h-6" />
                  <span className="text-xl font-semibold">Posts</span>
                  <span className="text-gray-700 dark:text-gray-300 text-sm ml-2 font-medium">
                    {pagination.total_count} 篇
                  </span>
                </div>
                <Search className="w-full max-w-full md:max-w-[min(100%,18rem)]" />
              </div>

              {(tagName || categoryName) && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {categoryName && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background text-foreground shadow-xs border border-border/60 text-sm">
                      <FolderOpen className="h-3 w-3" />
                      {categoryName}
                    </span>
                  )}
                  {tagName && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background text-foreground shadow-xs border border-border/60 text-sm">
                      <Tag className="h-3 w-3" />
                      {tagName}
                    </span>
                  )}
                  <Link
                    href="/blog"
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-transparent text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground ml-1"
                    scroll
                  >
                    ✕
                  </Link>
                </div>
              )}
              <div className="flex flex-col gap-4 min-h-[600px]">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
              {pagination.total_page > 1 && (
                <nav
                  className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 pt-8 text-sm sm:justify-end"
                  aria-label="分页"
                >
                  {pagination.page_no > 1 ? (
                    <Link
                      href={`/blog?${buildBlogListQuery(pagination.page_no - 1, navTag, navCategory)}`}
                      scroll
                      className="rounded-sm px-2 py-1 text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      上一页
                    </Link>
                  ) : (
                    <span className="cursor-default px-2 py-1 text-muted-foreground/45">上一页</span>
                  )}
                  <span className="select-none px-1.5 text-muted-foreground/45" aria-hidden>
                    ·
                  </span>
                  {pageItems.map((page, idx) => (
                    <span key={page} className="inline-flex items-center">
                      {idx > 0 ? (
                        <span className="select-none px-1 text-muted-foreground/45" aria-hidden>
                          ·
                        </span>
                      ) : null}
                      {page === pagination.page_no ? (
                        <span
                          className="min-w-6 px-1 py-1 text-center tabular-nums font-medium text-foreground"
                          aria-current="page"
                        >
                          {page}
                        </span>
                      ) : (
                        <Link
                          href={`/blog?${buildBlogListQuery(page, navTag, navCategory)}`}
                          scroll
                          className="min-w-6 px-1 py-1 text-center tabular-nums text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          {page}
                        </Link>
                      )}
                    </span>
                  ))}
                  <span className="select-none px-1.5 text-muted-foreground/45" aria-hidden>
                    ·
                  </span>
                  {pagination.page_no < pagination.total_page ? (
                    <Link
                      href={`/blog?${buildBlogListQuery(pagination.page_no + 1, navTag, navCategory)}`}
                      scroll
                      className="rounded-sm px-2 py-1 text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      下一页
                    </Link>
                  ) : (
                    <span className="cursor-default px-2 py-1 text-muted-foreground/45">下一页</span>
                  )}
                </nav>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
