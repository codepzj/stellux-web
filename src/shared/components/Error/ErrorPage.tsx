'use client'

import { Button } from '@/shared/ui/button'
import { useRouter } from 'next/navigation'

interface ErrorPageProps {
  title?: string
  message?: string
  showHomeButton?: boolean
  showBackButton?: boolean
  className?: string
}

export function ErrorPage({
  title = '出错了',
  message = '',
  showHomeButton = true,
  showBackButton = true,
  className = '',
}: ErrorPageProps) {
  const router = useRouter()

  return (
    <div
      className={`min-h-[calc(100vh-300px)] bg-white dark:bg-gray-950 flex items-center justify-center p-4 ${className}`}
    >
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        {message ? <p className="text-gray-600 dark:text-gray-400">{message}</p> : null}
        <div className="flex justify-center gap-3">
          {showHomeButton && <Button onClick={() => router.push('/')}>返回首页</Button>}
          {showBackButton && (
            <Button variant="outline" onClick={() => router.back()}>
              返回上页
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
