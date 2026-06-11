import { Card } from '@/shared/ui/card'
import { cn, contentListCardClassName } from '@/shared/lib/utils'
import { AspectRatio } from '@/shared/ui/aspect-ratio'
import { Skeleton } from '@/shared/ui/skeleton'

export function ContentListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, idx) => (
        <Card
          key={idx}
          className={cn('border-0 shadow-none max-sm:p-3.5', contentListCardClassName)}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-5">
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2.5 sm:gap-3">
              <div className="space-y-1.5 sm:space-y-2">
                <Skeleton className="h-5 w-[85%] rounded sm:h-6" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-4/5 rounded sm:hidden" />
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>

            <div className="relative hidden w-36 shrink-0 sm:block md:w-40">
              <AspectRatio
                ratio={16 / 9}
                className="overflow-hidden rounded-lg bg-muted/30 ring-1 ring-inset ring-border/60"
              >
                <Skeleton className="h-full w-full rounded-lg" />
              </AspectRatio>
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}
