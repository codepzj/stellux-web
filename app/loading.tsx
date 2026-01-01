import { Skeleton } from '@/components/ui/skeleton'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PostLoading() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8 sm:space-y-12">
          {/* Hero Section Skeleton */}
          <section className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar skeleton */}
            <Skeleton className="w-20 h-20 sm:w-28 sm:h-28 rounded-full shrink-0" />

            <div className="space-y-3 flex-1">
              {/* Name skeleton */}
              <Skeleton className="h-8 w-48" />

              {/* Location skeleton */}
              <Skeleton className="h-4 w-32" />

              {/* Bio skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Links skeleton */}
              <div className="flex flex-wrap gap-2 pt-1">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
            </div>
          </section>

          {/* Tech Stack Skeleton */}
          <section className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-20 rounded-full" />
              ))}
            </div>
          </section>

          {/* GitHub Activity Skeleton */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex gap-1">
                {Array.from({ length: 53 }).map((_, i) => (
                  <Skeleton key={i} className="h-3 w-3 rounded-sm" />
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <Skeleton className="h-3 w-24" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-sm" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </section>

          {/* Recent Posts Skeleton */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50"
                >
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-3" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Open Source Projects Skeleton */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </section>

          {/* Motto Skeleton */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="p-4 rounded-xl bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
