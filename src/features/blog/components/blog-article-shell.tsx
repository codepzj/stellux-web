import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

/** 与 BlogListShell 相同的容器内边距，宽度由页面内层控制 */
export function BlogArticleShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative min-h-[60vh] bg-background', className)}>
      <div className="relative container mx-auto px-4 py-10 md:px-6 md:py-12">{children}</div>
    </div>
  )
}
