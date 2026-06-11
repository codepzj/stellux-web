'use client'

import { useRouter } from 'next/navigation'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-[120px] sm:text-[180px] font-bold leading-none text-gray-200 dark:text-gray-800 select-none">
          404
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 -mt-4 mb-2">
          页面未找到
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
          抱歉，您访问的页面不存在或已被移除
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            首页
          </button>
        </div>
      </div>
    </div>
  )
}
