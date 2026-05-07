'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Rss } from 'lucide-react'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { SITE_NAV_LINKS, isSiteNavActive } from '@/lib/site-nav'
import { cn } from '@/lib/utils'

export function Footer({ className, ...props }: React.ComponentProps<'footer'>) {
  const year = new Date().getFullYear()
  const pathname = usePathname()

  return (
    <footer
      role="contentinfo"
      className={cn(
        'mt-auto w-full border-t border-border/60 bg-background',
        'text-xs text-muted-foreground transition-colors duration-200',
        className
      )}
      {...props}
    >
      <div className="grid w-full grid-cols-1 justify-items-center gap-y-4 px-4 py-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:justify-items-stretch md:gap-x-8 md:gap-y-0 md:py-3.5">
        <p className="text-center tabular-nums md:justify-self-start md:text-left">
          © {year}{' '}
          <span className="font-medium text-foreground/90">stellux</span>
        </p>

        <nav
          aria-label="页脚导航"
          className="flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 md:justify-self-center md:gap-x-5"
        >
          {SITE_NAV_LINKS.map((item) => {
            const active = isSiteNavActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'cursor-pointer font-medium transition-colors duration-200',
                  active ? 'text-foreground' : 'hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            )
          })}
          <Link
            href="/rss.xml"
            prefetch={false}
            aria-label="RSS 订阅"
            title="RSS"
            className={cn(
              'inline-flex cursor-pointer rounded-sm p-0.5 text-muted-foreground transition-colors duration-200',
              'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            )}
          >
            <Rss className="size-3.5" aria-hidden />
          </Link>
        </nav>

        <div className="flex justify-center md:justify-self-end">
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  )
}
