import { Suspense } from 'react'
import { PostListPage } from '@/features/admin/components/post-list-page'

export default function AdminPostListRoute() {
  return (
    <Suspense fallback={null}>
      <PostListPage />
    </Suspense>
  )
}
