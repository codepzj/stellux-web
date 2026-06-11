import '@/global.css'

import { Providers } from './providers'
import { Metadata } from 'next'
import { generatePageMetadata, getSEOConfig } from '@/shared/lib/seo'
import { fontVariables } from '@/shared/lib/fonts'

// 布局组件
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 获取SEO配置以设置author meta标签
  const seoConfig = await getSEOConfig()

  return (
    <html suppressHydrationWarning lang="zh-CN" className={fontVariables}>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="Atom Feed" href="/atom.xml" />
        <meta
          name="google-site-verification"
          content="rQ0kTqa4G_WtJzaC27Mg1VizLHmc7R7ri7ZyNCjMQmo"
        />
        <meta name="msvalidate.01" content="30CD55A935E75B69A1565E31EA21513B" />
        <meta name="author" content={seoConfig.author} />
      </head>
      <body className="min-h-screen bg-background antialiased w-full font-sans">
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>{children}</Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata()
}
