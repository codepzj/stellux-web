'use client'

import { Sparkles } from 'lucide-react'
import { useLayoutEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  text: string
  className?: string
}

function msPerChar(len: number) {
  if (len > 160) return 18
  if (len > 80) return 24
  return 32
}

export function ArticleDescriptionTypewriter({ text, className }: Props) {
  const full = text.trim()
  const [shown, setShown] = useState('')
  const [complete, setComplete] = useState(false)

  useLayoutEffect(() => {
    const chars = full ? Array.from(full) : []
    if (!full || chars.length === 0) {
      setShown('')
      setComplete(true)
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setShown(full)
      setComplete(true)
      return
    }

    setShown('')
    setComplete(false)
    let i = 0
    let timeoutId: ReturnType<typeof setTimeout>
    let cancelled = false
    const delay = msPerChar(chars.length)
    const step = () => {
      if (cancelled) return
      i += 1
      setShown(chars.slice(0, i).join(''))
      if (i >= chars.length) {
        setComplete(true)
        return
      }
      timeoutId = setTimeout(step, delay)
    }
    timeoutId = setTimeout(step, delay)
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [full])

  return (
    <p className={cn('mt-6 flex gap-3 text-left text-sm leading-relaxed md:mt-7 md:text-[15px] md:leading-relaxed', className)}>
      <Sparkles
        className="mt-1 size-4 shrink-0 text-primary/40 md:mt-1.5"
        aria-hidden
        strokeWidth={1.75}
      />
      <span className="sr-only">{full}</span>
      <span className="min-h-[1.5rem] text-muted-foreground md:min-h-[1.625rem]" aria-hidden>
        {shown}
        {!complete && (
          <span
            className="ml-0.5 inline-block h-[0.85em] w-[2px] animate-pulse rounded-[1px] bg-primary/55 align-middle"
            aria-hidden
          />
        )}
      </span>
    </p>
  )
}
