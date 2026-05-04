export const BLOG_PAGE_SIZE = 10

export type BlogListPagination = {
  total_page: number
  page_no: number
  total_count: number
}

export const INITIAL_BLOG_PAGINATION: BlogListPagination = {
  total_page: 1,
  page_no: 1,
  total_count: 0,
}

export function buildBlogListQuery(page: number, tag?: string, category?: string): string {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (tag) params.set('tag', tag)
  else if (category) params.set('category', category)
  return params.toString()
}

export function getPaginationWindow(totalPage: number, currentPage: number): number[] {
  const pages = Array.from({ length: totalPage }, (_, i) => i + 1)
  return pages.slice(
    Math.max(0, currentPage - 3),
    Math.min(totalPage, currentPage + 2)
  )
}

/** 翻页时保留当前筛选：优先标签，其次分类 */
export function paginationFilters(tagName: string, categoryName: string) {
  if (tagName) {
    return { tag: tagName, category: undefined as string | undefined }
  }
  return { tag: undefined as string | undefined, category: categoryName || undefined }
}
