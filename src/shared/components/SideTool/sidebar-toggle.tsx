'use client'

import { Button } from '@/shared/ui/button'
import { PanelRightOpen } from 'lucide-react'
import { useSidebar } from '@/shared/ui/sidebar'

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      aria-label="折叠侧边栏"
      size="icon"
      variant="outline"
      className="fixed bottom-16 right-6 z-60 size-9 rounded-full border-border/80 bg-background/90 shadow-md backdrop-blur-sm hover:bg-background"
      onClick={toggleSidebar}
    >
      <PanelRightOpen className="w-5 h-5" />
    </Button>
  )
}
