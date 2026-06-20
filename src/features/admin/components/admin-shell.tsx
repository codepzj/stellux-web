'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOutIcon, MenuIcon, MoonIcon, SunIcon, UserRoundPenIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/ui/sidebar'
import { Skeleton } from '@/shared/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/lib/utils'
import { adminNavItems, buildAdminBreadcrumbs } from '@/entities/admin/routes'
import { useAdminAuth } from './auth-provider'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { isReady, token, user, logout } = useAdminAuth()
  const pathname = usePathname()
  const breadcrumbs = buildAdminBreadcrumbs(pathname)

  if (!isReady || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex w-80 flex-col gap-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link
            href="/admin/post/create"
            className="flex h-12 w-full items-center px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          >
            <img
              src="/admin/logo-light.png"
              alt="Stellux"
              className="h-auto w-32 object-contain group-data-[collapsible=icon]:!hidden dark:hidden"
            />
            <img
              src="/admin/logo-dark.png"
              alt="Stellux"
              className="hidden h-auto w-32 object-contain group-data-[collapsible=icon]:!hidden dark:block"
            />
            <img
              src="/admin/logo-sm-light.png"
              alt="Stellux"
              className="hidden size-8 object-contain group-data-[collapsible=icon]:block group-data-[collapsible=icon]:dark:hidden"
            />
            <img
              src="/admin/logo-sm-dark.png"
              alt="Stellux"
              className="hidden size-8 object-contain group-data-[collapsible=icon]:dark:block"
            />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          {adminNavItems.map((item) => (
            <SidebarGroup key={item.href}>
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {(
                    item.children?.filter((child) => !child.hidden && !child.sidebarHidden) ?? [
                      item,
                    ]
                  ).map((child) => {
                    const href =
                      child.href === '/admin/post/list' ? `${child.href}?type=publish` : child.href
                    const active = pathname === child.href || pathname.startsWith(`${child.href}/`)
                    const Icon = child.icon ?? item.icon
                    return (
                      <SidebarMenuItem key={child.href}>
                        <SidebarMenuButton asChild isActive={active} tooltip={child.title}>
                          <Link href={href}>
                            {Icon && <Icon data-icon="inline-start" />}
                            <span>{child.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger aria-label="切换侧边栏" />
            <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="菜单">
              <MenuIcon />
            </Button>
            <Breadcrumb className="min-w-0">
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => {
                  const isLast = index === breadcrumbs.length - 1
                  return (
                    <React.Fragment key={`${item.href}-${item.title}`}>
                      <BreadcrumbItem
                        className={cn(index < breadcrumbs.length - 1 && 'hidden md:block')}
                      >
                        {isLast ? (
                          <BreadcrumbPage className="truncate">{item.title}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={item.href}>{item.title}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                    </React.Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <AdminThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-2 px-2">
                  <Avatar className="size-7">
                    <AvatarImage src={user?.avatar} alt={user?.username} />
                    <AvatarFallback>{user?.nickname?.slice(0, 1) || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-28 truncate text-sm md:inline">
                    {user?.nickname || user?.username || '管理员'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/user/edit/basic">
                      <UserRoundPenIcon data-icon="inline-start" />
                      编辑资料
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOutIcon data-icon="inline-start" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="min-h-[calc(100svh-3.5rem)] overflow-x-hidden bg-muted/20 p-4 md:p-6">
          <div className="flex w-full min-w-0 flex-col gap-4">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function AdminThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'
  const label = isDark ? '切换浅色模式' : '切换深色模式'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          className={cn(!mounted && 'pointer-events-none opacity-60')}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
