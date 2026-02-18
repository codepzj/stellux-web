'use client'

import { GalleryVerticalEnd } from 'lucide-react'

export function DocTitle({ docTitle }: { docTitle: string }) {
  return (
    <div className="flex items-center gap-3 transition-opacity duration-200">
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg shadow-sm">
        <GalleryVerticalEnd className="size-4" />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5 leading-tight">
        <span className="truncate font-medium">{docTitle}</span>
      </div>
    </div>
  )
}
