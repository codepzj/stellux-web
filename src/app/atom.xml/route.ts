import { NextRequest } from 'next/server'
import { getAllPublishPostAPI } from '@/entities/post/api'
import { getSEOConfig } from '@/shared/lib/seo'

export async function GET(request: NextRequest) {
  try {
    const posts = await getAllPublishPostAPI()
    const seoConfig = await getSEOConfig()
    const siteUrl = request.nextUrl.origin

    const postsData = posts?.code === 200 && posts?.data ? posts.data : []

    const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${seoConfig.title}</title>
  <link href="${siteUrl}" />
  <link href="${siteUrl}/atom.xml" rel="self" type="application/atom+xml" />
  <id>${siteUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>${seoConfig.author}</name>
  </author>
  <subtitle>${seoConfig.description}</subtitle>
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

export const revalidate = 3600
