export const SITE_NAV_LINKS = [
  { href: '/blog', label: 'Posts' },
  { href: '/document', label: 'Docs' },
  { href: '/about', label: 'About' },
  { href: '/friends', label: 'Friends' },
] as const

export function isSiteNavActive(pathname: string, href: string): boolean {
  const currentPath = pathname.split('/')[1] || '/'
  return currentPath === href.split('/')[1] || (currentPath === '/' && href === '/')
}
