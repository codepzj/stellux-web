'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@/components/SvgIcon'
import { Skeleton } from '@/components/ui/skeleton'
import { getActivePageConfigAPI } from '@/api/page'
import { PageContent } from '@/types/page'
import './index.css'

const NAV_LINKS = [
  { href: '/blog', label: 'Posts' },
  { href: '/document', label: 'Docs' },
  { href: '/about', label: 'About' },
  { href: '/friends', label: 'Friends' },
]


function DesktopNav() {
  const pathname = usePathname()
  const currentPath = pathname.split('/')[1] || '/'

  return (
    <>
      <nav className="hidden w-full md:flex items-center justify-end space-x-6">
        {NAV_LINKS.map((item) => {
          const isActive =
            currentPath === item.href.split('/')[1] || (currentPath === '/' && item.href === '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[14px] font-medium navbar-link ${
                isActive
                  ? 'text-foreground nav-link-active'
                  : 'text-gray-700 hover:text-foreground dark:text-gray-300'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="切换主题"
    >
      {/* 同时渲染两个图标，依赖 html.dark 类控制显示，避免首次客户端插入造成闪烁 */}
      <SunIcon size={18} className="hidden dark:inline text-gray-600 dark:text-gray-300" />
      <MoonIcon size={18} className="inline dark:hidden text-gray-600 dark:text-gray-300" />
    </button>
  )
}

function MobileNav({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed inset-x-0 top-14 z-30 bg-white/90 dark:bg-black/70 border-b border-gray-200/60 dark:border-white/10">
      <div className="flex flex-col space-y-3 px-4 py-3">
        {NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className="px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-100 hover:text-foreground transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [pageConfig, setPageConfig] = useState<PageContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await getActivePageConfigAPI('home')
        if (response.data?.content) {
          setPageConfig(response.data.content)
        }
      } catch (error) {
        console.error('获取主页配置失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [])

  return (
    <header className="sticky top-0 z-20 w-full bg-white/90 dark:bg-black/70 border-b border-gray-200/60 dark:border-white/10">
      <div className="mx-auto flex h-14 items-center justify-between px-4 max-w-5xl">
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3 shrink-0 min-w-[120px] md:min-w-[140px]"
        >
          {isLoading ? (
            <Skeleton className="w-7 h-7 md:w-8 md:h-8 rounded-full shrink-0" />
          ) : pageConfig?.avatar ? (
            <img
              src={pageConfig.avatar}
              alt="avatar"
              className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover"
              loading="lazy"
            />
          ) : null}
          {isLoading ? (
            <Skeleton className="h-5 w-24 md:w-28 rounded" />
          ) : (
            <span className="text-[15px] font-semibold text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
              {pageConfig?.name || 'Stellux'}
            </span>
          )}
        </Link>

        {/* 桌面导航 */}
        <DesktopNav />

        {/* 右侧操作区 */}
        <div className="flex items-center space-x-2">
          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="菜单"
          >
            {isMenuOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 12h16M4 6h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && <MobileNav onClick={() => setIsMenuOpen(false)} />}
    </header>
  )
}
