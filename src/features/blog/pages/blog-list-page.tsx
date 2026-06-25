import type { Metadata } from 'next'
import { getPostListAPI } from '@/entities/post/api'
import { ErrorPage } from '@/shared/components/Error/ErrorPage'
import { Provider } from '@/features/blog/components/search-provider'
import { BlogListSection } from '@/features/blog/components/blog-list-section'
import { BLOG_PAGE_SIZE } from '@/shared/lib/blog-list'
import { generatePageMetadata, getSEOConfig } from '@/shared/lib/seo'
import { ScrollReset } from '@/shared/components/ScrollReset'

type BlogSearchParams = {
  page?: string
  tag?: string
  category?: string
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<BlogSearchParams>
}): Promise<Metadata> {
  const sp = await searchParams
  const seoConfig = await getSEOConfig()

  let segment = '博客'
  if (sp.tag) segment = `标签：${sp.tag}`
  else if (sp.category) segment = `分类：${sp.category}`

  const page = Math.max(1, Number(sp.page) || 1)
  if (page > 1) segment = `${segment} · 第${page}页`

  return generatePageMetadata({ title: `${segment} · ${seoConfig.title}` })
}

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<BlogSearchParams>
}) {
  const sp = await searchParams
  const currentPage = Math.max(1, Number(sp.page) || 1)
  const tagName = sp.tag ?? ''
  const categoryName = sp.category ?? ''

  const response = await getPostListAPI({
    page_no: currentPage,
    page_size: BLOG_PAGE_SIZE,
    label_name: tagName,
    category_name: categoryName,
  })

  if (response.code !== 200 || !response.data) {
    return <ErrorPage title="暂时无法获取文章列表" />
  }

  const data = response.data
  const posts = data.list ?? []
  const pagination = {
    total_page: data.total_page ?? 1,
    page_no: data.page_no ?? 1,
    total_count: data.total_count ?? 0,
  }

  if (posts.length === 0) {
    return <ErrorPage title="暂无博客内容" />
  }

  return (
    <Provider>
      <ScrollReset />
      <BlogListSection
        posts={posts}
        pagination={pagination}
        tagName={tagName}
        categoryName={categoryName}
      />
    </Provider>
  )
}
