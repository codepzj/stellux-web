'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Calendar, Tag, Book, FolderOpen } from 'lucide-react'
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
  const router = useRouter()

  return (
    <Card
      className={cn('border-0 shadow-none', contentListCardClassName)}
      onClick={() => router.push(`/blog/${post.alias}`)}
    >
      <CardContent className="p-0">
        <div className="flex items-stretch gap-4 min-h-[120px]">
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-medium tracking-tight text-gray-900 dark:text-gray-100 mt-1 mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-primary">
                {post.title}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-3">
                {post.description}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {post.category && (
                <Badge
                  variant="secondary"
                  labelRole="category"
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/blog?${buildBlogListQuery(1, undefined, post.category)}`)
                  }}
                >
                  <FolderOpen className="h-3 w-3 mr-1" />
                  {post.category}
                </Badge>
              )}
              {post.tags?.slice(0, 2).map((tag, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  labelRole="tag"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/blog?${buildBlogListQuery(1, tag, undefined)}`)
                  }}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end justify-between">
            <div className="hidden md:block w-48 mb-3 relative shrink-0">
              <AspectRatio
                ratio={16 / 9}
                className="relative overflow-hidden rounded-lg bg-muted/40 ring-1 ring-inset ring-black/6 dark:ring-white/10"
              >
                {post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    sizes="192px"
                    className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
                    {...(thumbnailPriority
                      ? { priority: true }
                      : { loading: 'lazy' as const })}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-muted/90 to-muted">
                    <Book className="w-8 h-8 text-muted-foreground/70" />
                  </div>
                )}
              </AspectRatio>
            </div>

            <div>
              <Badge
                variant="outline"
                labelRole="meta"
                className="text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <Calendar className="h-3 w-3 mr-1" />
                {formatRelativeTime(post.created_at)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
