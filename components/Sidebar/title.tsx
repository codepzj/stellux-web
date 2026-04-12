'use client'

import { WikiIcon } from '@/components/SvgIcon'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

export function DocTitle({ docTitle }: { docTitle: string }) {
  return (
    <div className="flex min-h-9 min-w-0 flex-1 items-center gap-1 py-0.5">
      <Link
        href="/document"
        tabIndex={0}
        aria-label="返回文档"
        className={cn(
          'group/back-link relative isolate inline-flex size-7 shrink-0 items-center justify-center rounded-md',
          'text-sidebar-foreground transition-colors hover:text-sidebar-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring'
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-md bg-black/12 opacity-0 transition-opacity group-hover/back-link:opacity-100 dark:bg-white/16"
        />
        <ChevronLeft className="relative z-10 size-3.5 shrink-0" aria-hidden />
      </Link>
      <div className="flex min-h-0 min-w-0 flex-1 items-center gap-1 text-sidebar-foreground">
        <span className="inline-flex size-8 shrink-0 items-center justify-center self-center" aria-hidden>
          <WikiIcon size={32} />
        </span>
        <span className="font-semibold min-h-5.5 min-w-0 flex-1 truncate py-px text-base leading-snug">
          {docTitle}
        </span>
      </div>
    </div>
  )
}
