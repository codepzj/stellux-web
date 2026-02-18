import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'

import { NavMain } from './nav-main'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { DocTitle } from './title'
import { DocTreeItem } from '@/utils/document-tree'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
// import { ThemeSwitcher } from '@/components/ThemeSwitcher'

export async function DocSidebar({
  docTitle,
  doctree,
  className,
}: {
  docTitle: string
  doctree: DocTreeItem[]
  className?: string
}) {
  return (
    <Sidebar collapsible="offcanvas" variant="sidebar" className={className}>
      <SidebarHeader className="px-3 pt-4 pb-3 gap-3 rounded-b-xl bg-sidebar/30 transition-colors duration-200">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <Link href="/document" className="block rounded-lg transition-colors duration-200 hover:bg-sidebar-accent/50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 px-3 py-2.5 text-sidebar-foreground/90 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              >
                <ArrowLeftIcon className="h-4 w-4 shrink-0 opacity-80" />
                <span className="text-sm">返回文档列表</span>
              </Button>
            </Link>
            <div className="my-1 h-px min-w-0 bg-sidebar-border/50" aria-hidden />
            <SidebarMenuButton
              size="lg"
              className="rounded-xl py-3 transition-colors duration-200 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <DocTitle docTitle={docTitle} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain doctree={doctree} />
      </SidebarContent>
      <SidebarFooter>
        {/* 开发环境显示主题切换器 */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="flex items-center justify-center">
            <ThemeSwitcher />
          </div>
        )} */}
      </SidebarFooter>
    </Sidebar>
  )
}
