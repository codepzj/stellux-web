import { Card } from '@/components/ui/card'
import { cn, contentListCardClassName } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import { BLOG_PAGE_SIZE } from '@/lib/blog-list'

export function BlogListSkeleton({ count = BLOG_PAGE_SIZE }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, idx) => (
        <Card
          key={idx}
          className={cn('border-0 shadow-none', contentListCardClassName)}
        >
          <div className="flex items-stretch gap-4 min-h-[120px]">
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <div className="hidden md:block w-48 h-27 mb-3">
                <AspectRatio
                  ratio={16 / 9}
                  className="overflow-hidden rounded-lg bg-muted/30 ring-1 ring-inset ring-black/6 dark:ring-white/10"
                >
                  <Skeleton className="h-full w-full rounded-lg" />
                </AspectRatio>
              </div>
              <div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}
