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

/** 最多展示 `maxVisible` 个连续页码，尽量让当前页靠近中间 */
export function getPaginationWindow(
  totalPage: number,
  currentPage: number,
  maxVisible = 5
): number[] {
  if (totalPage <= 0) return []
  const cap = Math.min(maxVisible, totalPage)
  if (totalPage <= maxVisible) {
    return Array.from({ length: totalPage }, (_, i) => i + 1)
  }
  const half = Math.floor(cap / 2)
  let start = currentPage - half
  let end = start + cap - 1
  if (start < 1) {
    start = 1
    end = cap
  }
  if (end > totalPage) {
    end = totalPage
    start = totalPage - cap + 1
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

/** 翻页时保留当前筛选：优先标签，其次分类 */
export function paginationFilters(tagName: string, categoryName: string) {
  if (tagName) {
    return { tag: tagName, category: undefined as string | undefined }
  }
  return { tag: undefined as string | undefined, category: categoryName || undefined }
}
