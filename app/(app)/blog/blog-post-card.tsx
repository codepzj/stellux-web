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

export function BlogPostCard({ post }: { post: PostVO }) {
  const router = useRouter()

  return (
    <Card
      className="border-0 shadow-none bg-white/90 dark:bg-card/80 p-4 hover:bg-gray-50 dark:hover:bg-card/90 cursor-pointer group rounded-lg relative transition-colors duration-200"
      onClick={() => router.push(`/blog/${post.alias}`)}
    >
      <CardContent className="p-0">
        <div className="flex items-stretch gap-4 min-h-[120px]">
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-1 mb-2 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-400 transition-colors duration-200">
                {post.title}
              </h3>

              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-3">
                {post.description}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {post.category && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200 cursor-pointer"
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
                  className="text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
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
            <div className="hidden md:block w-48 mb-3 relative">
              <AspectRatio ratio={16 / 9} className="relative overflow-hidden rounded-md">
                {post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    sizes="192px"
                    className="object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Book className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                  </div>
                )}
              </AspectRatio>
            </div>

            <div>
              <Badge
                variant="outline"
                className="text-xs text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
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
