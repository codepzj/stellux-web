import { JetBrains_Mono, Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google'

/** 界面、导航、卡片与标签：无衬线，中文屏显清晰 */
export const fontSans = Noto_Sans_SC({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans-sc',
  display: 'swap',
})

/** 长文与 Markdown 正文：衬线，长时间阅读更舒适 */
export const fontSerif = Noto_Serif_SC({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif-sc',
  display: 'swap',
})

/** 代码与等宽片段 */
export const fontMono = JetBrains_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-mono-jb',
  display: 'swap',
})

export const fontVariables = [fontSans.variable, fontSerif.variable, fontMono.variable].join(' ')
