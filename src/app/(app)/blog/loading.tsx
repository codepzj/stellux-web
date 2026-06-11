import { Provider } from '@/features/blog/components/search-provider'
import { BlogListHeader } from '@/features/blog/components/blog-list-header'
import { BlogListShell } from '@/features/blog/components/blog-list-shell'
import { BlogListSkeleton } from '@/features/blog/components/blog-list-skeleton'

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
