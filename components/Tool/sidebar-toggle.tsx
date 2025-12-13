'use client'

import { Button } from '@/components/ui/button'
import { PanelRightOpen } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      aria-label="折叠侧边栏"
      size="icon"
      variant="outline"
      className="fixed z-50 bottom-20 right-6 shadow-lg rounded-full bg-white"
      onClick={toggleSidebar}
    >
      <PanelRightOpen className="w-5 h-5" />
    </Button>
  )
}
