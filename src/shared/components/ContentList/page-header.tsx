import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export type ContentListPageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  className?: string
  trailing?: ReactNode
  meta?: {
    icon: LucideIcon
    label: string
  }
}

export function ContentListPageHeader({
  eyebrow,
  title,
  description,
  className,
  trailing,
  meta,
}: ContentListPageHeaderProps) {
  const MetaIcon = meta?.icon

  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b border-border/60 pb-6',
        trailing && 'md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
          {meta && MetaIcon ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MetaIcon className="size-3.5 opacity-70" aria-hidden />
              <span className="tabular-nums">{meta.label}</span>
            </span>
          ) : null}
        </div>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {trailing ? <div className="w-full shrink-0 md:w-auto">{trailing}</div> : null}
    </div>
  )
}
