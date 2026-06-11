import type { MetadataRoute } from 'next'
import { getSEOConfig } from '@/shared/lib/seo'

export default async function robots(): Promise<MetadataRoute.Robots> {
  try {
    const seoConfig = await getSEOConfig()
    const robotsMeta = seoConfig.robotsMeta || 'index,follow'

    // 解析robots meta
    const directives = robotsMeta.split(',').map((d: string) => d.trim())
    const allowAll = directives.includes('index')
    const disallowAll = directives.includes('noindex')

    return {
      rules: {
        userAgent: '*',
        allow: allowAll ? '/' : undefined,
        disallow: disallowAll ? '/' : undefined,
      },
    }
  } catch (error) {
    console.error('获取SEO配置失败,使用默认robots配置:', error)
  }

  // 默认配置
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
  }
}
