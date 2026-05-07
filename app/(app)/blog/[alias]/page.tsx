import { getPostByAliasAPI } from '@/api/post'
import { PostArticleHeader } from '@/components/Blog/PostArticleHeader'
import { Markdown } from '@/components/Md'
import { Metadata } from 'next'
import { Toc } from '@/components/Toc'
import { BackToTop } from '@/components/SideTool/back-to-top'
import { ScrollReset } from '@/components/ScrollReset'
import { getSEOConfig } from '@/utils/seo'
import { cache } from 'react'
import type { PostVO } from '@/types/post'

type Props = {
  params: Promise<{ alias: string }>
}

/** Markdown 含二级或三级标题时展示 TOC */
const H2_OR_H3_HEADING = /^##\s|^###\s/m

const getPostByAlias = cache(async (alias: string): Promise<PostVO> => {
  const { data } = await getPostByAliasAPI(alias)
  return data
})

function hasTocHeadings(content: string): boolean {
  return H2_OR_H3_HEADING.test(content)
}

export default async function BlogContent({ params }: Props) {
  const { alias } = await params
  const post = await getPostByAlias(alias)
  const showToc = hasTocHeadings(post.content)

  return (
    <>
      <ScrollReset />
      <div className="relative text-default-600 flex flex-col gap-4 lg:flex-row p-2 lg:p-4">
        <div className="w-full lg:w-4/5 px-4">
          <PostArticleHeader post={post} />
          <Markdown className="wrap-break-word overflow-x-auto" content={post.content} />
        </div>
        {showToc && (
          <div className="hidden relative lg:block lg:w-1/5">
            <Toc className="sticky top-20" content={post.content} />
          </div>
        )}
        <BackToTop />
      </div>
    </>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { alias } = await params
  const [post, seoConfig] = await Promise.all([getPostByAlias(alias), getSEOConfig()])

  const { title, description, thumbnail: image, category, tags } = post
  const keywords = [category, ...(tags ?? [])].filter(Boolean)
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
    authors: [{ name: seoConfig.author }],
    metadataBase: new URL(url),
  }
}

export const dynamic = 'force-dynamic' // 禁用缓存
