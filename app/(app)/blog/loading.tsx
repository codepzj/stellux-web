import { Book } from 'lucide-react'
import { Provider } from './provider'
import { Search } from './search'
import { BlogListSkeleton } from './blog-list-skeleton'

export default function BlogListLoading() {
  return (
    <Provider>
      <div className="dark:bg-gray-950 min-h-screen">
        <div className="w-full">
          <div className="container mx-auto px-4 py-12 md:px-6 md:py-24">
            <div className="max-w-5xl mx-auto space-y-12">
              <section className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Book className="w-6 h-6" />
                    <span className="text-xl font-semibold">Posts</span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm ml-2 font-medium">
                      …
                    </span>
                  </div>
                  <Search className="md:w-52" />
                </div>
                <div className="flex flex-col gap-4 min-h-[600px]">
                  <BlogListSkeleton />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Provider>
  )
}
