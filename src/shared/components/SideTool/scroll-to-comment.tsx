'use client'

import { Button } from '@/shared/ui/button'
import { MessageCircleMore } from 'lucide-react'

export function ScrollToComment() {
  return (
    <Button
      aria-label="跳转到评论"
      title="跳转到评论"
      size="icon"
      variant="outline"
      className="fixed bottom-[8.75rem] right-6 z-50 rounded-full border-border/80 bg-background/90 text-muted-foreground shadow-md backdrop-blur-sm hover:bg-muted/70 hover:text-foreground"
      onClick={() => {
        const comment = document.getElementById('comment')
        if (comment) {
          comment.scrollIntoView({ behavior: 'smooth' })
        }
      }}
    >
      <MessageCircleMore className="size-5" />
    </Button>
  )
}
