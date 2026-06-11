import { InboxIcon, type LucideIcon } from 'lucide-react'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty'
import { cn } from '@/shared/lib/utils'

interface AdminEmptyStateProps {
  title?: string
  description?: string
  icon?: LucideIcon
  className?: string
}

export function AdminEmptyState({
  title = '暂无数据',
  description = '当前还没有可显示的内容。',
  icon: Icon = InboxIcon,
  className,
}: AdminEmptyStateProps) {
  return (
    <Empty className={cn('min-h-72 border-0', className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
