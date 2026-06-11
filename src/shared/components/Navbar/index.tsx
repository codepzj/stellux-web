'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE_CONTENT_MAX_CLASS } from '@/shared/lib/blog-layout'
import { HOME_PROFILE } from '@/shared/lib/site-profile'
import { SITE_NAV_LINKS, isSiteNavActive } from '@/shared/lib/site-nav'
import { cn } from '@/shared/lib/utils'
import './index.css'

function DesktopNav() {
  const pathname = usePathname()

  return (
    <>
      <nav className="hidden w-full md:flex items-center justify-end space-x-6">
        {SITE_NAV_LINKS.map((item) => {
          const isActive = isSiteNavActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`cursor-pointer text-[14px] font-medium navbar-link transition-colors duration-200 ${
                isActive
                  ? 'text-foreground nav-link-active'
                  : 'text-gray-700 hover:text-foreground dark:text-zinc-200 dark:hover:text-white'
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

function MobileNav({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed inset-x-0 top-14 z-30 bg-white/90 dark:bg-black/70 border-b border-gray-200/60 dark:border-white/10">
      <div
        className={cn('mx-auto flex flex-col space-y-3 px-4 py-3 md:px-6', SITE_CONTENT_MAX_CLASS)}
      >
        {SITE_NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className="cursor-pointer px-2 py-1.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-foreground dark:text-gray-100"
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

  return (
    <header className="sticky top-0 z-20 w-full bg-white/90 dark:bg-black/70 border-b border-gray-200/60 dark:border-white/10">
      <div
        className={cn(
          'mx-auto flex h-14 w-full items-center justify-between px-4 md:px-6',
          SITE_CONTENT_MAX_CLASS
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3 shrink-0 min-w-[120px] md:min-w-[140px]"
        >
          {HOME_PROFILE.avatar ? (
            <img
              src={HOME_PROFILE.avatar}
              alt="avatar"
              className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover"
              loading="lazy"
            />
          ) : null}
          <span className="text-[15px] font-semibold text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
            {HOME_PROFILE.name}
          </span>
        </Link>

        <DesktopNav />

        <div className="flex items-center space-x-2">
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

      {isMenuOpen && <MobileNav onClick={() => setIsMenuOpen(false)} />}
    </header>
  )
}
