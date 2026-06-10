import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { PostListPage } from '@/components/Admin/post-list-page'

export default function AdminPostListRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <PostListPage />
    </Suspense>
  )
}
