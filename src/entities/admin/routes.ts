import {
  ArchiveIcon,
  BookTextIcon,
  BookOpenIcon,
  ClipboardPenIcon,
  FilePlusIcon,
  ListIcon,
  TagsIcon,
  UserIcon,
  UserRoundPenIcon,
  UsersRoundIcon,
  type LucideIcon,
} from 'lucide-react'
import type { PostListType } from '@/entities/admin/types/post'

export const ADMIN_DEFAULT_PATH = '/admin/post/create'
export const ADMIN_LOGIN_PATH = '/admin/login'

export interface AdminNavItem {
  title: string
  href: string
  icon?: LucideIcon
  hidden?: boolean
  sidebarHidden?: boolean
  children?: AdminNavItem[]
}

export const adminNavItems: AdminNavItem[] = [
  {
    title: '文章',
    href: '/admin/post',
    icon: ClipboardPenIcon,
    children: [
      { title: '发布文章', href: '/admin/post/create', icon: FilePlusIcon },
      { title: '文章列表', href: '/admin/post/list', icon: ListIcon },
      { title: '文章标签', href: '/admin/post/label', icon: TagsIcon },
      { title: '编辑文章', href: '/admin/post/edit', hidden: true },
    ],
  },
  {
    title: '文档',
    href: '/admin/document',
    icon: BookTextIcon,
    children: [
      { title: '列表页', href: '/admin/document/overview', icon: BookOpenIcon },
      { title: '回收箱', href: '/admin/document/bin', icon: ArchiveIcon },
      { title: '文档内容', href: '/admin/document/content', hidden: true },
    ],
  },
  {
    title: '友链',
    href: '/admin/friend',
    icon: UsersRoundIcon,
  },
  {
    title: '用户',
    href: '/admin/user',
    icon: UserIcon,
    children: [
      { title: '用户列表', href: '/admin/user/list' },
      {
        title: '编辑资料',
        href: '/admin/user/edit',
        icon: UserRoundPenIcon,
        sidebarHidden: true,
        children: [
          { title: '基本信息', href: '/admin/user/edit/basic' },
          { title: '重置密码', href: '/admin/user/edit/reset-password' },
        ],
      },
    ],
  },
]

export function normalizePostListType(value: string | string[] | null | undefined): PostListType {
  const current = Array.isArray(value) ? value[0] : value
  return current === 'draft' || current === 'bin' ? current : 'publish'
}

export function getAdminNavItemByPath(pathname: string): AdminNavItem | undefined {
  const walk = (items: AdminNavItem[]): AdminNavItem | undefined => {
    for (const item of items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return walk(item.children ?? []) ?? item
      }
    }
    return undefined
  }

  return walk(adminNavItems)
}

export function buildAdminBreadcrumbs(pathname: string): AdminNavItem[] {
  const matches: AdminNavItem[] = []

  const walk = (items: AdminNavItem[], parents: AdminNavItem[]): boolean => {
    for (const item of items) {
      const isMatch = pathname === item.href || pathname.startsWith(`${item.href}/`)
      const nextParents = [...parents, item]

      if (isMatch && walk(item.children ?? [], nextParents)) {
        return true
      }

      if (isMatch) {
        matches.push(...nextParents)
        return true
      }
    }

    return false
  }

  walk(adminNavItems, [])
  return matches.filter((item) => !item.hidden)
}
