'use client'

import { useEffect, useLayoutEffect, useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

export function ScrollReset() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeKey = useMemo(() => `${pathname}?${searchParams.toString()}`, [pathname, searchParams])

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useLayoutEffect(() => {
    scrollToTop()

    const frame = window.requestAnimationFrame(scrollToTop)
    const timer = window.setTimeout(scrollToTop, 120)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [routeKey])

  return null
}
