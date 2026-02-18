'use client'

import { cn } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <div
        id="content"
        className={cn(
          'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
          'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
          'sm:transition-[width] sm:duration-200 sm:ease-linear',
          'flex min-h-0 flex-1 flex-col',
          'group-data-[scroll-locked=1]/body:h-full',
          'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh',
          'w-full mx-auto max-w-5xl'
        )}
      >
        {children}
        <Footer />
      </div>
    </div>
  )
}
