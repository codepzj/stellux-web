import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Github, Globe, MapPin, FileText, Calendar, ArrowRight, Quote } from 'lucide-react'
import { getAllPublishPostAPI } from '@/api/post'
import { getActivePageConfigAPI } from '@/api/page'
import { PageContent } from '@/types/page'
import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import GitHubCalendar from '@/components/Home/GitHubCalendar'

export const dynamic = 'force-dynamic'

// 从 GitHub URL 中提取用户名
function extractGitHubUsername(githubUrl: string | undefined): string | null {
  if (!githubUrl) return null
  
  try {
    const urlPattern = /github\.com\/([^/]+)/i
    const match = githubUrl.match(urlPattern)
    if (match && match[1]) {
      return match[1]
    }
    
    // 如果直接是用户名
    if (!githubUrl.includes('/') && !githubUrl.includes('.')) {
      return githubUrl
    }
    
    return null
  } catch {
    return null
  }
}

export default async function Page() {
  const [postsResult, pageConfigResult] = await Promise.allSettled([
    getAllPublishPostAPI(),
    getActivePageConfigAPI('home'),
  ])

  const posts = postsResult.status === 'fulfilled' ? postsResult.value.data : null
  const pageConfig = pageConfigResult.status === 'fulfilled' ? pageConfigResult.value.data : null

  const config: PageContent | undefined = pageConfig?.content
  const shouldShowRecentPosts = config?.show_recent_posts === true
  const recentPosts =
    shouldShowRecentPosts && posts
      ? posts.slice(0, config?.recent_posts_count || 2)
      : []

  // 使用配置数据，如果没有配置则不显示
  const shouldShowRepositories = config?.show_repositories === true
  const repositories = shouldShowRepositories ? (config?.repositories || []) : []
  const techStacks = config?.tech_stacks || []
  const githubUsername = extractGitHubUsername(config?.github)

  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8 sm:space-y-12">
          {/* Hero Section */}
          {(config?.avatar || config?.name || config?.location || config?.bio || config?.github || config?.blog) && (
            <section className="flex flex-col sm:flex-row items-start gap-6">
              {config?.avatar && (
                <Image
                  src={config.avatar}
                  alt="avatar"
                  width={120}
                  height={120}
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-full ring-4 ring-gray-100 dark:ring-gray-800"
                  unoptimized
                />
              )}
              <div className="space-y-3">
                {config?.name && (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Hi, I'm {config.name} 👋
                  </h1>
                )}
                {config?.location && (
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {config.location}
                  </p>
                )}
                {(config?.bio || config?.quote) && (
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 max-w-lg">
                    {config?.bio}
                    {config?.quote && (
                      <span className="text-gray-500 dark:text-gray-400">「{config.quote}」</span>
                    )}
                  </p>
                )}
                {(config?.github || config?.blog) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {config?.github && (
                      <a
                        href={config.github}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        <Github className="w-3.5 h-3.5" />
                        GitHub
                      </a>
                    )}
                    {config?.blog && (
                      <a
                        href={config.blog}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Blog
                      </a>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Tech Stack */}
          {techStacks.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                技术栈
              </h2>
              <div className="flex flex-wrap gap-2">
                {techStacks.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* GitHub Activity */}
          {githubUsername && (
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                GitHub 活动
              </h2>
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 overflow-x-auto">
                <GitHubCalendar username={githubUsername} />
              </div>
            </section>
          )}

          {/* Recent Posts */}
          {shouldShowRecentPosts && recentPosts.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  最新文章
                </h2>
                <Link
                  href="/blog"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
                >
                  查看全部 <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.alias || post.id}`}
                    className="group p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900/50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-300 line-clamp-1 transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                      <span>{dayjs(post.created_at).format('YYYY-MM-DD')}</span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                        {post.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Open Source Projects */}
          {shouldShowRepositories && repositories.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Github className="w-5 h-5" />
                开源项目
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {repositories.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Github className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                        {repo.name}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{repo.desc}</p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Motto */}
          {config?.motto && (
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Quote className="w-5 h-5" />
                座右铭
              </h2>
              <div className="p-4 rounded-xl bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  "{config.motto}"
                </p>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
