'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Tag, BookOpen, FolderOpen, Pin } from 'lucide-react'
import { formatRelativeTime } from '@/utils/date'
import type { PostVO } from '@/types/post'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { buildBlogListQuery } from '@/lib/blog-list'
import { contentListCardClassName, cn } from '@/lib/utils'

export function BlogPostCard({
  post,
  thumbnailPriority = false,
}: {
  post: PostVO
  thumbnailPriority?: boolean
}) {
  return (
    <Card
      className={cn(
        'border-0 shadow-none max-sm:p-3.5',
        contentListCardClassName
      )}
    >
      <Link
        href={`/blog/${post.alias}`}
        scroll
        className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`阅读：${post.title}`}
      />
      <CardContent className="relative z-10 p-0 pointer-events-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-5">
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-2.5 sm:gap-3">
            <div className="min-w-0">
              {post.is_top ? (
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <Badge
                    variant="secondary"
                    className="border-primary/20 bg-primary/8 text-primary dark:bg-primary/15"
                  >
                    <Pin className="size-3" aria-hidden />
                    置顶
                  </Badge>
                </div>
              ) : null}
              <h2 className="line-clamp-2 font-serif text-base font-semibold leading-snug tracking-tight text-foreground group-hover:text-primary sm:text-lg md:text-xl">
                {post.title}
              </h2>
              {post.description ? (
                <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:mt-2 sm:line-clamp-2 md:line-clamp-1">
                  {post.description}
                </p>
              ) : null}
            </div>

            <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 sm:gap-2">
              {post.category ? (
                <Link
                  href={`/blog?${buildBlogListQuery(1, undefined, post.category)}`}
                  scroll
                  className="max-w-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Badge
                    variant="secondary"
                    labelRole="category"
                    className="max-w-full cursor-pointer [&>span]:truncate"
                  >
                    <FolderOpen className="size-3 shrink-0" aria-hidden />
                    <span className="truncate">{post.category}</span>
                  </Badge>
                </Link>
              ) : null}
              {post.tags?.slice(0, 2).map((tag, i) => (
                <Link
                  key={i}
                  href={`/blog?${buildBlogListQuery(1, tag, undefined)}`}
                  scroll
                  className="max-w-[min(100%,12rem)] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Badge
                    variant="outline"
                    labelRole="tag"
                    className="max-w-full cursor-pointer [&>span]:truncate"
                  >
                    <Tag className="size-3 shrink-0" aria-hidden />
                    <span className="truncate">{tag}</span>
                  </Badge>
                </Link>
              ))}
              <Badge variant="outline" labelRole="meta" className="w-fit shrink-0">
                <Calendar className="size-3 shrink-0" aria-hidden />
                {formatRelativeTime(post.created_at)}
              </Badge>
            </div>
          </div>

          <div className="relative hidden w-36 shrink-0 sm:block md:w-40">
            <AspectRatio
              ratio={16 / 9}
              className="overflow-hidden rounded-lg bg-muted/50 ring-1 ring-inset ring-border/60"
            >
              {post.thumbnail ? (
                <Image
                  src={post.thumbnail}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.04]"
                  {...(thumbnailPriority
                    ? { priority: true }
                    : { loading: 'lazy' as const })}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-muted/80 to-muted/40">
                  <BookOpen className="size-8 text-muted-foreground/60" aria-hidden />
                </div>
              )}
            </AspectRatio>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
