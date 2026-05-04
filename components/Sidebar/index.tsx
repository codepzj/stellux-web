import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'

import { NavMain } from './nav-main'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { DocTitle } from './title'
import { DocTreeItem } from '@/utils/document-tree'

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
      <SidebarHeader className="px-1 pt-4 pb-3 rounded-b-xl bg-sidebar/30 transition-colors duration-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="mt-2">
              <DocTitle docTitle={docTitle} />
              <div className="mt-2 h-px min-w-0" aria-hidden />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain doctree={doctree} />
      </SidebarContent>
    </Sidebar>
  )
}
