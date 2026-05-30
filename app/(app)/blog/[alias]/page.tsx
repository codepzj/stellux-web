import { getPostByAliasAPI } from '@/api/post'
import { PostArticleHeader } from '@/components/Blog/PostArticleHeader'
import { BlogArticleShell } from '@/components/Blog/blog-article-shell'
import { Markdown } from '@/components/Md'
import { Metadata } from 'next'
import { FloatingToc } from '@/components/Toc'
import { BackToTop } from '@/components/SideTool/back-to-top'
import { ScrollReset } from '@/components/ScrollReset'
import { getSEOConfig } from '@/utils/seo'
import { cache } from 'react'
import { cn } from '@/lib/utils'
import { BLOG_CONTENT_MAX_CLASS } from '@/lib/blog-layout'
import type { PostVO } from '@/types/post'

type Props = {
  params: Promise<{ alias: string }>
}

const getPostByAlias = cache(async (alias: string): Promise<PostVO> => {
  const { data } = await getPostByAliasAPI(alias)
  return data
})

export default async function BlogContent({ params }: Props) {
  const { alias } = await params
  const post = await getPostByAlias(alias)

  return (
    <>
      <ScrollReset />
      <BlogArticleShell>
        <div className={cn('mx-auto w-full', BLOG_CONTENT_MAX_CLASS)}>
          <article className="min-w-0">
            <PostArticleHeader post={post} />
            <Markdown className="wrap-break-word" content={post.content} />
          </article>
        </div>
        <FloatingToc content={post.content} />
        <BackToTop />
      </BlogArticleShell>
    </>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { alias } = await params
  const [post, seoConfig] = await Promise.all([getPostByAlias(alias), getSEOConfig()])

  const { title, description, thumbnail: image, category, tags } = post
  const keywords = [category, ...(tags ?? [])].filter(Boolean)
  const url = `/blog/${alias}`

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
