'use client'

import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  return (
    <Button
      aria-label="回到顶部"
      size="icon"
      variant="outline"
      className="fixed z-50 bottom-6 right-6 shadow-lg rounded-full bg-white"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  )
}
