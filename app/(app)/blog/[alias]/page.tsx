import { getPostByAliasAPI } from '@/api/post'
import { Markdown } from '@/components/Md'
import { Metadata } from 'next'
import { Toc } from '@/components/Toc'
import { BackToTop } from '@/components/SideTool/back-to-top'
// import { ScrollToComment } from '@/components/Tool/scroll-to-comment'
import { formatDate, formatRelativeTime, estimateReadingTime } from '@/lib/time-utils'
import { Calendar, Clock, BookOpen } from 'lucide-react'

type Props = {
  params: Promise<{ alias: string }>
}

export default async function BlogContent({ params }: Props) {
  const { alias } = await params
  const post = await getPostByAliasAPI(alias).then((res) => {
    return res.data
  })

  // 检查内容是否包含二级(##)或三级(###)标题
  const hasHeadings = /^##\s|^###\s/m.test(post.content)

  return (
    <div className="relative text-default-600 flex flex-col gap-4 lg:flex-row p-2 lg:p-4">
      <div className="w-full lg:w-4/5 p-4">
        <div className="text-3xl font-bold font-mono py-4 mb-4">{post.title}</div>

        {/* 文章元信息 */}
        <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-8 px-2">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 md:h-4 md:w-4 text-gray-500 dark:text-gray-400" />
            <span className="font-medium">
              <span className="md:hidden">
                {formatRelativeTime(post.updated_at)}
              </span>
              <span className="hidden md:inline">
                更新于 {formatRelativeTime(post.updated_at)}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3 md:h-4 md:w-4 text-gray-500 dark:text-gray-400" />
            <span className="font-medium">
              <span className="md:hidden">
                {estimateReadingTime(post.content)}min
              </span>
              <span className="hidden md:inline">
                约 {estimateReadingTime(post.content)} 分钟阅读
              </span>
            </span>
          </div>
        </div>

        <div className="h-4" />
        <Markdown className="wrap-break-word overflow-x-auto" content={post.content} />
      </div>
      {hasHeadings && (
        <div className="hidden relative lg:block lg:w-1/5">
          <Toc className="sticky top-20" content={post.content} />
        </div>
      )}
      <BackToTop />
      {/* <ScrollToComment /> */}
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { alias } = await params
  const post = await getPostByAliasAPI(alias).then((res) => {
    return res.data
  })

  const title = post.title
  const description = post.description
  const image = post.thumbnail
  const keywords = [post.category, ...(post.tags || [])].filter(Boolean)
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${alias}`

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    authors: [{ name: post.author }],
    metadataBase: new URL(url),
  }
}

export const dynamic = 'force-dynamic' // 禁用缓存
