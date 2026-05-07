'use client'

import { useEffect, useState } from 'react'
import { getAllPublicDocument } from '@/api/document'
import type { DocumentVO } from '@/types/document'
import { Book, FileText } from 'lucide-react'
import { WikiIcon } from '@/components/SvgIcon'
import { ErrorPage } from '@/components/Error/ErrorPage'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import NextLink from 'next/link'
import { cn, contentListCardClassName } from '@/lib/utils'

export default function DocumentPage() {
  const [docList, setDocList] = useState<DocumentVO[]>([])
  const [loading, setLoading] = useState(true)
  const skeletonCount = docList.length > 0 ? docList.length : 4

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAllPublicDocument()
      setDocList(res.data || [])
    } catch (error) {
      console.error('获取文档列表失败:', error)
      setDocList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 如果无数据，直接显示极简空态，避免显示标题与总数
  if (!loading && docList.length === 0) {
    return <ErrorPage title="暂无公开文档" />
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-950 min-h-screen">
        <div className="container px-4 py-12 md:px-6 md:py-24">
          <div className="mx-auto max-w-5xl space-y-12">
            <section className="space-y-6">
              {/* 顶部标题与总数样式与博客列表保持一致 */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
                <div className="flex items-center gap-2">
                  <Book className="w-6 h-6" />
                  <span className="text-xl font-semibold">Docs</span>
                  <span className="text-gray-500 dark:text-gray-300 text-sm ml-2">{docList.length} 篇</span>
                </div>
              </div>
              <div className="h-4" />
              <div className="flex flex-col gap-4 min-h-[600px]">
                {loading
                  ? Array.from({ length: skeletonCount }).map((_, idx) => (
                      <Card
                        key={idx}
                        className={cn('border-0 shadow-none', contentListCardClassName)}
                      >
                        <div className="flex items-stretch gap-4 min-h-[120px]">
                          {/* 左侧内容骨架屏 */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div className="space-y-2">
                              {/* 标题骨架屏 */}
                              <Skeleton className="h-5 w-3/4" />
                              <Skeleton className="h-5 w-5/6" />
                              {/* 描述骨架屏 */}
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                            {/* 标签骨架屏 */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                          </div>
                          {/* 右侧图片骨架屏 */}
                          <div className="flex flex-col items-end justify-between">
                            {/* 右侧图片骨架屏 */}
                            <div className="hidden md:block w-48 h-27 mb-3 shrink-0">
                              <AspectRatio
                                ratio={16 / 9}
                                className="overflow-hidden rounded-lg bg-muted/30 ring-1 ring-inset ring-black/6 dark:ring-white/10"
                              >
                                <Skeleton className="h-full w-full rounded-lg" />
                              </AspectRatio>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  : docList.map((item) => (
                      <NextLink
                        key={item.id}
                        href={`/document/${item.alias}`}
                        className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <Card className={cn('border-0 shadow-none', contentListCardClassName)}>
                          <CardContent className="p-0">
                            <div className="flex items-stretch gap-4 min-h-[120px]">
                              {/* 内容区域 */}
                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                  {/* 文章标题 */}
                                  <h3 className="text-lg font-medium tracking-tight text-gray-900 dark:text-gray-100 mt-1 mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-primary">
                                    {item.title}
                                  </h3>

                                  {/* 文章摘要 */}
                                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-3">
                                    {item.description}
                                  </p>
                                </div>

                                {/* 分类和标签 - 固定在卡片最底部 */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* 显示文档类型 */}
                                  <Badge
                                    variant="secondary"
                                    labelRole="category"
                                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200 cursor-pointer"
                                  >
                                    <FileText className="h-3 w-3 mr-1" />
                                    文档
                                  </Badge>
                                </div>
                              </div>

                              {/* 右侧区域 - 图片和时间 */}
                              <div className="flex flex-col items-end justify-between">
                                {/* 右侧图片 - 固定16:9比例 */}
                                <div className="hidden md:block w-48 h-27 mb-3 shrink-0">
                                  <AspectRatio
                                    ratio={16 / 9}
                                    className="overflow-hidden rounded-lg bg-muted/40 ring-1 ring-inset ring-black/6 dark:ring-white/10"
                                  >
                                    {item.thumbnail ? (
                                      <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted/90 to-muted">
                                        <WikiIcon className="h-8 w-8 text-muted-foreground/70" />
                                      </div>
                                    )}
                                  </AspectRatio>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </NextLink>
                    ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
