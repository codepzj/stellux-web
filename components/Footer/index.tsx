'use client'

import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { cn } from '@/lib/utils'

export function Footer({ className, ...props }: React.ComponentProps<'footer'>) {
  const year = new Date().getFullYear()

  return (
    <footer
      role="contentinfo"
      className={cn(
        'mt-auto w-full border-t border-border/70 bg-background/90 text-muted-foreground backdrop-blur-md transition-colors dark:border-border/50 dark:bg-background/75',
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-4">
        <p className="text-center text-xs leading-relaxed sm:text-left sm:text-sm">
          <span className="tabular-nums">© {year}</span>
          <span className="mx-2 text-border/90 dark:text-border" aria-hidden>
            ·
          </span>
          <span className="font-medium text-foreground/90">stellux</span>
        </p>
        <div className="flex items-center justify-center gap-2 sm:justify-end">
          <span className="hidden text-xs text-muted-foreground sm:inline">主题</span>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  )
}
