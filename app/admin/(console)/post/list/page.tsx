import { Suspense } from 'react'
import { PostListPage } from '@/components/Admin/post-list-page'

export default function AdminPostListRoute() {
  return (
    <Suspense fallback={null}>
      <PostListPage />
    </Suspense>
  )
}
