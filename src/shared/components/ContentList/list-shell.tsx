import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { BLOG_CONTENT_MAX_CLASS } from '@/shared/lib/blog-layout'

export function ContentListShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative min-h-[60vh] bg-background', className)}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,var(--color-primary)/0.06,transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,var(--color-primary)/0.12,transparent)]"
        aria-hidden
      />
      <div className="relative container mx-auto px-4 py-10 md:px-6 md:py-16">
        <div className={cn('mx-auto w-full space-y-8', BLOG_CONTENT_MAX_CLASS)}>{children}</div>
      </div>
    </div>
  )
}
