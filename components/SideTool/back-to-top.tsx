'use client'

import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  return (
    <Button
      aria-label="回到顶部"
      size="icon"
      variant="outline"
      className="fixed bottom-6 right-6 z-60 rounded-full border-border/80 bg-background/90 shadow-md backdrop-blur-sm"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  )
}
