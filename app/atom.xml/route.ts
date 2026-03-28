import { NextRequest } from 'next/server'
import { getAllPublishPostAPI } from '@/api/post'
import { getConfigMapAPI } from '@/api/config'

export async function GET(request: NextRequest) {
  try {
    const posts = await getAllPublishPostAPI()
    const config = await getConfigMapAPI()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin


    const SEOTitle = config?.data?.seo.Content.SEOTitle
    const SEOAuthor = config?.data?.seo.Content.SEOAuthor
    const SEODescription = config?.data?.seo.Content.SEODescription

    // 确保 posts.data 存在且为数组，同时检查 API 返回状态
    const postsData = posts?.code === 200 && posts?.data ? posts.data : []

    const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${SEOTitle}</title>
  <link href="${siteUrl}" />
  <link href="${siteUrl}/atom.xml" rel="self" type="application/atom+xml" />
  <id>${siteUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>${SEOAuthor}</name>
  </author>
  <subtitle>${SEODescription}</subtitle>
  ${postsData
    .map(
      (post) => `
  <entry>
    <title>${post.title}</title>
    <link href="${siteUrl}/blog/${post.alias}" />
    <id>${siteUrl}/blog/${post.alias}</id>
    <updated>${new Date(post.created_at).toISOString()}</updated>
    <summary>${post.description || post.content || post.title}</summary>
    ${post.tags && post.tags.length > 0 ? post.tags.map((tag) => `<category term="${tag}" />`).join('') : ''}
  </entry>
  `
    )
    .join('')}
</feed>`

    return new Response(atom, {
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Atom generation error:', error)
    return new Response('Error generating Atom feed', { status: 500 })
  }
}

export const revalidate = 3600 // 1 hour
