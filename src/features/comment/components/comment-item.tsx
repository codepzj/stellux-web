'use client'

import type { ReactNode } from 'react'
import { Globe2, Monitor, Reply } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import type { CommentVO } from '@/entities/comment/types'
import { cn } from '@/shared/lib/utils'
import { getCommentMetaFromUserAgent } from '@/shared/lib/comment-meta'
import { CommentMarkdown } from './comment-markdown'

type Props = {
  comment: CommentVO
  isReply?: boolean
  replyToNickname?: string
  onReply?: (comment: CommentVO) => void
  children?: ReactNode
}

function getSafeWebsiteUrl(website: string) {
  const trimmedWebsite = website.trim()
  if (!trimmedWebsite) {
    return ''
  }

  const href = /^https?:\/\//i.test(trimmedWebsite) ? trimmedWebsite : `https://${trimmedWebsite}`

  try {
    const url = new URL(href)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : ''
  } catch {
    return ''
  }
}

export function CommentItem({
  comment,
  isReply = false,
  replyToNickname,
  onReply,
  children,
}: Props) {
  const fallback = comment.nickname.trim().slice(0, 1).toUpperCase() || 'C'
  const formattedTime = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(comment.created_at))
  const metaItems = getCommentMetaFromUserAgent(comment.user_agent)
  const websiteUrl = getSafeWebsiteUrl(comment.website)

  const avatar = (
    <Avatar
      className={cn('size-10 rounded-full border border-border/60 bg-muted', isReply && 'size-7')}
    >
      {comment.avatar ? <AvatarImage src={comment.avatar} alt={comment.nickname} /> : null}
      <AvatarFallback className="bg-muted text-sm font-semibold text-muted-foreground">
        {fallback}
      </AvatarFallback>
    </Avatar>
  )

  return (
    <article
      className={cn(
        'group grid grid-cols-[2.75rem_1fr] gap-3',
        isReply && 'grid-cols-[2.25rem_1fr] gap-2'
      )}
    >
      <div className="flex justify-center pt-0.5">{avatar}</div>

      <div className="min-w-0">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <header className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-1">
            {websiteUrl ? (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="truncate text-sm font-semibold text-foreground underline-offset-4 transition-colors hover:text-muted-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border/70"
                aria-label={`访问 ${comment.nickname} 的网站`}
              >
                {comment.nickname}
              </a>
            ) : (
              <span className="truncate text-sm font-semibold text-foreground">
                {comment.nickname}
              </span>
            )}
            <time className="text-xs text-muted-foreground" dateTime={comment.created_at}>
              {formattedTime}
            </time>
          </header>

          {!isReply && onReply ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 text-muted-foreground/70 opacity-70 hover:bg-muted/50 hover:text-foreground group-hover:opacity-100"
              onClick={() => onReply(comment)}
              aria-label={`回复 ${comment.nickname}`}
            >
              <Reply className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
        </div>

        {replyToNickname ? (
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            回复 <span className="text-foreground">@{replyToNickname}</span>：
          </p>
        ) : null}

        <CommentMarkdown content={comment.content} className="mt-1" />

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground/80">
          {metaItems.map((item, index) => (
            <span key={item} className="inline-flex items-center gap-1">
              {index === 0 ? (
                <Monitor className="size-3.5" aria-hidden="true" />
              ) : (
                <Globe2 className="size-3.5" aria-hidden="true" />
              )}
              {item}
            </span>
          ))}
        </div>

        {children}
      </div>
    </article>
  )
}
