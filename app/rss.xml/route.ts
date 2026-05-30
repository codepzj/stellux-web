import { NextRequest } from 'next/server'
import { getAllPublishPostAPI } from '@/api/post'
import { getSEOConfig } from '@/utils/seo'

export async function GET(request: NextRequest) {
  try {
    const posts = await getAllPublishPostAPI()
    const siteUrl = request.nextUrl.origin
    const seoConfig = await getSEOConfig()

    // 确保 posts.data 存在且为数组
    const postsData = posts?.data ? posts.data : []

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${seoConfig.title}</title>
    <link>${siteUrl}</link>
    <description>${seoConfig.description}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <follow_challenge>
      <feedId>183725508737880064</feedId>
      <userId>74684007892567040</userId>
    </follow_challenge>
    ${postsData
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.alias}</link>
      <guid>${siteUrl}/blog/${post.alias}</guid>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${post.description || post.content || post.title}]]></description>
      ${post.tags && post.tags.length > 0 ? `<category>${post.tags.join(', ')}</category>` : ''}
    </item>
    `
      )
      .join('')}
  </channel>
</rss>`

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('RSS generation error:', error)
    // 即使出错也返回基本的 RSS，包含频道信息
    const siteUrl = request.nextUrl.origin
    const fallbackRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Gopher</title>
    <link>${siteUrl}</link>
    <description>Gopher的个人技术博客,记录Golang学习与开发实践。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <follow_challenge>
      <feedId>183725508737880064</feedId>
      <userId>74684007892567040</userId>
    </follow_challenge>
  </channel>
</rss>`

    return new Response(fallbackRss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
}
