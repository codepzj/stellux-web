'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeftIcon, MessageSquareTextIcon } from 'lucide-react'
import { toast } from 'sonner'
import { AdminEmptyState } from '@/features/admin/components/admin-empty-state'
import { AdminTableLoadingRow } from '@/features/admin/components/admin-loading-state'
import { useAdminAuth } from '@/features/admin/components/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { getCommentAdminAPI } from '@/entities/admin/api'
import { getCommentListAPI } from '@/entities/comment/api'
import type { CommentVO } from '@/entities/admin/types/comment'
import type { CommentVO as PublicCommentVO } from '@/entities/comment/types'

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDateTime(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date)
}

function shortID(value: string) {
  return value.length > 10 ? `${value.slice(0, 6)}...${value.slice(-4)}` : value
}

export function CommentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { request } = useAdminAuth()
  const [comment, setComment] = React.useState<CommentVO | null>(null)
  const [childComments, setChildComments] = React.useState<PublicCommentVO[]>([])
  const [loading, setLoading] = React.useState(true)
  const [childLoading, setChildLoading] = React.useState(false)

  React.useEffect(() => {
    setLoading(true)
    getCommentAdminAPI(request, id)
      .then((response) => setComment(response.data))
      .catch((error) => toast.error(error instanceof Error ? error.message : '加载评论详情失败'))
      .finally(() => setLoading(false))
  }, [id, request])

  React.useEffect(() => {
    if (!comment) {
      setChildComments([])
      return
    }

    let cancelled = false
    setChildLoading(true)
    getCommentListAPI(comment.post_id)
      .then((response) => {
        if (cancelled) return
        setChildComments(response.data.filter((item) => item.parent_id === comment.id))
      })
      .catch((error) => {
        if (cancelled) return
        setChildComments([])
        toast.error(error instanceof Error ? error.message : '加载子评论失败')
      })
      .finally(() => {
        if (!cancelled) setChildLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [comment])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold">评论详情</h1>
          <p className="mt-1 text-sm text-muted-foreground">查看主评论及其子评论。</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/comment">
            <ArrowLeftIcon data-icon="inline-start" />
            返回列表
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableBody>
              <AdminTableLoadingRow colSpan={4} className="min-h-48" />
            </TableBody>
          </Table>
        </div>
      ) : comment ? (
        <>
          <div className="rounded-md border bg-background p-4">
            <div className="mb-3 text-sm font-medium">父评论信息</div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 gap-3">
                <Avatar>
                  <AvatarImage src={comment.avatar} alt={comment.nickname} />
                  <AvatarFallback>{comment.nickname.slice(0, 1) || '评'}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{comment.nickname}</span>
                    <Badge variant="secondary">主评论</Badge>
                  </div>
                  <div className="mt-1 font-mono text-xs text-muted-foreground">{comment.id}</div>
                  <div className="mt-3 whitespace-pre-wrap text-sm">{comment.content}</div>
                </div>
              </div>
              <dl className="grid shrink-0 gap-x-3 gap-y-2 text-sm sm:grid-cols-[5rem_16rem]">
                <dt className="text-muted-foreground">文章</dt>
                <dd className="min-w-0">
                  {comment.post_alias ? (
                    <Link
                      href={`/blog/${comment.post_alias}`}
                      target="_blank"
                      className="block truncate underline"
                    >
                      {comment.post_title || shortID(comment.post_id)}
                    </Link>
                  ) : (
                    <span className="font-mono text-xs">{shortID(comment.post_id)}</span>
                  )}
                </dd>
                <dt className="text-muted-foreground">邮箱</dt>
                <dd className="truncate">{comment.email}</dd>
                <dt className="text-muted-foreground">站点</dt>
                <dd className="truncate">{comment.website || '-'}</dd>
                <dt className="text-muted-foreground">时间</dt>
                <dd>{formatDateTime(comment.created_at)}</dd>
              </dl>
            </div>
          </div>

          <div className="flex min-h-[calc(100svh-20rem)] flex-1 flex-col gap-4">
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>评论者</TableHead>
                    <TableHead>内容</TableHead>
                    <TableHead>联系</TableHead>
                    <TableHead>设备</TableHead>
                    <TableHead>时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {childLoading ? (
                    <AdminTableLoadingRow colSpan={5} className="min-h-[320px]" />
                  ) : childComments.length ? (
                    childComments.map((child) => (
                      <TableRow key={child.id}>
                        <TableCell className="min-w-48">
                          <div className="font-medium">{child.nickname}</div>
                          <div className="font-mono text-xs text-muted-foreground">
                            {shortID(child.id)}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-96">
                          <div className="line-clamp-2 text-sm">{child.content}</div>
                        </TableCell>
                        <TableCell className="min-w-56">
                          <div className="flex flex-col gap-1 text-sm">
                            <a href={`mailto:${child.email}`} className="max-w-44 truncate">
                              {child.email}
                            </a>
                            {child.website && (
                              <a
                                href={child.website}
                                target="_blank"
                                rel="noreferrer"
                                className="max-w-44 truncate text-muted-foreground underline"
                              >
                                {child.website}
                              </a>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-64">
                          <div className="font-mono text-xs text-muted-foreground">
                            {shortID(child.device_id)}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {child.user_agent}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-36 text-sm text-muted-foreground">
                          {formatDateTime(child.created_at)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <AdminEmptyState
                          icon={MessageSquareTextIcon}
                          title="暂无子评论"
                          description="这条主评论下还没有回复。"
                          className="min-h-[320px]"
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      ) : (
        <AdminEmptyState
          icon={MessageSquareTextIcon}
          title="评论不存在"
          description="无法找到这条评论。"
          className="min-h-[360px]"
        />
      )}
    </div>
  )
}
