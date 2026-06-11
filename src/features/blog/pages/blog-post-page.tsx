import { getPostByAliasAPI } from '@/entities/post/api'
import { PostArticleHeader } from '@/features/blog/components/PostArticleHeader'
import { BlogArticleShell } from '@/features/blog/components/blog-article-shell'
import { Markdown } from '@/shared/components/Md'
import { Metadata } from 'next'
import { FloatingToc } from '@/shared/components/Toc'
import { BackToTop } from '@/shared/components/SideTool/back-to-top'
import { ScrollToComment } from '@/shared/components/SideTool/scroll-to-comment'
import { ScrollReset } from '@/shared/components/ScrollReset'
import { CommentSection } from '@/features/comment/components/comment-section'
import { getSEOConfig } from '@/shared/lib/seo'
import { cache } from 'react'
import { cn } from '@/shared/lib/utils'
import { BLOG_CONTENT_MAX_CLASS } from '@/shared/lib/blog-layout'
import type { PostVO } from '@/entities/post/types'

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
          <CommentSection postId={post.id} />
        </div>
        <FloatingToc content={post.content} />
        <ScrollToComment />
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
  }
}

export const dynamic = 'force-dynamic' // 禁用缓存
