import { Provider } from './provider'
import { BlogListHeader } from '@/components/Blog/blog-list-header'
import { BlogListShell } from '@/components/Blog/blog-list-shell'
import { BlogListSkeleton } from './blog-list-skeleton'

export default function BlogListLoading() {
  return (
    <Provider>
      <BlogListShell>
        <BlogListHeader totalCount="…" />
        <div className="flex flex-col gap-3">
          <BlogListSkeleton />
        </div>
      </BlogListShell>
    </Provider>
  )
}
