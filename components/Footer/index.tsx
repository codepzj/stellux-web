'use client'

import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { cn } from '@/lib/utils'

export function Footer({ className, ...props }: React.ComponentProps<'footer'>) {
  return (
    <footer
      role="contentinfo"
      className={cn(
        'mt-auto flex w-full items-center justify-between gap-4 border-t border-border/60 bg-background/80 px-4 py-3 text-sm text-muted-foreground backdrop-blur-sm',
        className
      )}
      {...props}
    >
      <span className="shrink-0">
        © {new Date().getFullYear()} stellux
      </span>
      <div className="flex items-center gap-2">
        <span className="hidden text-muted-foreground/80 sm:inline">Theme</span>
        <ThemeSwitcher />
      </div>
    </footer>
  )
}
