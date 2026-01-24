import { getPostByAliasAPI } from '@/api/post'
import { Markdown } from '@/components/Md'
import { Metadata } from 'next'
import { Toc } from '@/components/Toc'
import { BackToTop } from '@/components/Tool/back-to-top'
// import { ScrollToComment } from '@/components/Tool/scroll-to-comment'
import { formatDate, estimateReadingTime } from '@/lib/time-utils'

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
        <h1 className="text-3xl text-default-900 font-medium text-center">{post.title}</h1>

        {/* 文章元信息 */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 my-4 px-4">
          <span>发布于 {formatDate(post.created_at)}</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span>{estimateReadingTime(post.content)} 分钟阅读</span>
        </div>

        <div className="h-10" />
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
