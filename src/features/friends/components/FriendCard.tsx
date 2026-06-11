'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import { FriendShowVO } from '@/entities/friend/api'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'
import { ExternalLink, Globe } from 'lucide-react'

type Props = {
  friend: FriendShowVO
}

const TYPE_LABELS: Record<number, string> = {
  0: '大佬',
  1: '技术型',
  2: '设计型',
  3: '生活型',
}

export default function FriendCard({ friend }: Props) {
  const typeLabel = TYPE_LABELS[friend.website_type] ?? '其他'
  const avatarSrc = friend.avatar_url

  return (
    <Link
      href={friend.site_url}
      target="_blank"
      rel="noreferrer noopener"
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card
        className={cn(
          'group flex h-full min-h-40 cursor-pointer flex-col gap-3 overflow-hidden rounded-xl border border-border/70 bg-card/90 p-4 shadow-sm shadow-black/[0.04]',
          'transition-[border-color,background-color,box-shadow,transform] duration-200',
          'hover:-translate-y-0.5 hover:border-border hover:bg-muted/30 hover:shadow-md hover:shadow-black/[0.07]',
          'dark:bg-card/75 dark:shadow-black/20 dark:hover:bg-card/90 dark:hover:shadow-lg dark:hover:shadow-black/30'
        )}
      >
        <CardHeader className="flex flex-row items-start gap-3.5 p-0">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border/70 ring-offset-2 ring-offset-background">
            <Image
              alt={friend.name}
              src={avatarSrc}
              fill
              sizes="56px"
              className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
            />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
              {friend.name}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2 min-h-[2lh] text-sm leading-relaxed text-muted-foreground">
              {friend.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardFooter className="mt-auto flex items-center gap-2 p-0 pt-3">
          <Badge variant="secondary" labelRole="category" className="bg-muted text-foreground">
            <Globe className="size-3" aria-hidden />
            {typeLabel}
          </Badge>
          <Badge variant="outline" labelRole="meta" className="bg-background/70">
            <ExternalLink className="size-3" aria-hidden />
            访问
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}
