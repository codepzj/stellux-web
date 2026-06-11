// SEO配置类型
export interface SEOConfig {
  title: string
  description: string
  keywords: string
  author: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  robotsMeta: string
  twitterCard: string
}

// 获取SEO配置
export async function getSEOConfig(): Promise<SEOConfig> {
  return {
    title: '浩瀚星河 - 个人技术博客',
    description: '浩瀚星河的个人技术博客,记录Golang学习与开发实践。',
    keywords: 'Go,GoZero,Kratos,Echo,Redis,Mysql,Pgsql,Mongodb,K8S',
    author: '浩瀚星河',
    ogTitle: '浩瀚星河 - 个人技术博客',
    ogDescription: '浩瀚星河的个人技术博客,记录Golang学习与开发实践。',
    ogImage: 'https://cdn.codepzj.cn/image/20250825180716208.png',
    robotsMeta: 'index,follow',
    twitterCard: 'summary_large_image',
  }
}

// 生成页面元数据
export async function generatePageMetadata(overrides?: Partial<SEOConfig>) {
  const seoConfig = await getSEOConfig()

  return {
    title: overrides?.title || seoConfig.title,
    description: overrides?.description || seoConfig.description,
    keywords: overrides?.keywords || seoConfig.keywords,
    authors: [{ name: overrides?.author || seoConfig.author }],
    creator: overrides?.author || seoConfig.author,
    publisher: overrides?.author || seoConfig.author,
    robots: overrides?.robotsMeta || seoConfig.robotsMeta,
    openGraph: {
      title: overrides?.ogTitle || seoConfig.ogTitle,
      description: overrides?.ogDescription || seoConfig.ogDescription,
      siteName: overrides?.title || seoConfig.title,
      images: [
        {
          url: overrides?.ogImage || seoConfig.ogImage,
          width: 1200,
          height: 630,
          alt: overrides?.ogTitle || seoConfig.ogTitle,
        },
      ],
      locale: 'zh-CN',
      type: 'website',
    },
    twitter: {
      card: overrides?.twitterCard || seoConfig.twitterCard,
      title: overrides?.ogTitle || seoConfig.ogTitle,
      description: overrides?.ogDescription || seoConfig.ogDescription,
      images: [overrides?.ogImage || seoConfig.ogImage],
    },
  }
}
