import { Skeleton } from '@/shared/ui/skeleton'
import { TableCell, TableRow } from '@/shared/ui/table'
import { cn } from '@/shared/lib/utils'

interface AdminTableLoadingRowProps {
  colSpan: number
  rows?: number
  className?: string
}

export function AdminTableLoadingRow({ colSpan, rows = 5, className }: AdminTableLoadingRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="p-0">
        <div className={cn('flex min-h-72 flex-col gap-3 p-4', className)}>
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[minmax(12rem,1fr)_8rem_8rem_6rem] items-center gap-4"
            >
              <Skeleton className="h-5 w-full max-w-sm" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="ml-auto h-8 w-16" />
            </div>
          ))}
        </div>
      </TableCell>
    </TableRow>
  )
}

export function AdminBlockLoadingState({ className }: { className?: string }) {
  return (
    <div className={cn('grid min-h-72 gap-4 md:grid-cols-2 xl:grid-cols-3', className)}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-md border bg-background p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="size-8" />
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function AdminTreeLoadingState({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2 py-2', className)}>
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-2"
          style={{ paddingLeft: `${(index % 3) * 16}px` }}
        >
          <Skeleton className="size-4" />
          <Skeleton className={cn('h-5', index % 3 === 0 ? 'w-36' : 'w-28')} />
        </div>
      ))}
    </div>
  )
}
