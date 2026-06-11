import { FileText } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

type DocumentListHeaderProps = {
  totalCount: number | '…'
  className?: string
}

export function DocumentListHeader({ totalCount, className }: DocumentListHeaderProps) {
  return (
    <div
      className={cn('border-b border-border/60 pb-6', className)}
    >
      <div className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Library
        </p>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            文档
          </h1>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <FileText className="size-3.5 opacity-70" aria-hidden />
            <span className="tabular-nums">
              {totalCount === '…' ? '…' : `${totalCount} 篇`}
            </span>
          </span>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          结构化知识库与公开文档，便于查阅与沉淀。
        </p>
      </div>
    </div>
  )
}
