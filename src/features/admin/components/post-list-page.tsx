'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FileTextIcon } from 'lucide-react'
import { toast } from 'sonner'
import { AdminEmptyState } from '@/features/admin/components/admin-empty-state'
import { AdminTableLoadingRow } from '@/features/admin/components/admin-loading-state'
import { AdminPagination } from '@/features/admin/components/admin-pagination'
import { ConfirmDialog } from '@/features/admin/components/confirm-dialog'
import { useAdminAuth } from '@/features/admin/components/auth-provider'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Input } from '@/shared/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import {
  deletePostAPI,
  deletePostBatchAPI,
  getPostListAPI,
  restorePostAPI,
  restorePostBatchAPI,
  softDeletePostAPI,
  softDeletePostBatchAPI,
  updatePostPublishStatusAPI,
} from '@/entities/admin/api'
import { normalizePostListType } from '@/entities/admin/routes'
import type { PostDetailVO, PostListType } from '@/entities/admin/types/post'

const typeText: Record<PostListType, string> = {
  publish: '已发布',
  draft: '草稿箱',
  bin: '回收站',
}

export function PostListPage() {
  const searchParams = useSearchParams()
  const type = normalizePostListType(searchParams.get('type'))
  const { request } = useAdminAuth()
  const [keyword, setKeyword] = React.useState('')
  const [pageNo, setPageNo] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(20)
  const [total, setTotal] = React.useState(0)
  const [posts, setPosts] = React.useState<PostDetailVO[]>([])
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(true)

  const loadPosts = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await getPostListAPI(request, type, {
        page_no: pageNo,
        page_size: pageSize,
        keyword,
      })
      setPosts(response.data.list)
      setTotal(response.data.total_count)
      setSelectedIds([])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '加载文章失败')
    } finally {
      setLoading(false)
    }
  }, [keyword, pageNo, pageSize, request, type])

  React.useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const runAndReload = async (action: () => Promise<unknown>, success: string) => {
    try {
      await action()
      toast.success(success)
      await loadPosts()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作失败')
    }
  }

  const batchDelete = () =>
    runAndReload(
      () =>
        type === 'bin'
          ? deletePostBatchAPI(request, selectedIds)
          : softDeletePostBatchAPI(request, selectedIds),
      '批量操作成功'
    )

  const batchRestore = () =>
    runAndReload(() => restorePostBatchAPI(request, selectedIds), '批量恢复成功')

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold">文章列表</h1>
          <p className="mt-1 text-sm text-muted-foreground">{typeText[type]}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant={type === 'publish' ? 'default' : 'outline'}>
            <Link href="/admin/post/list?type=publish">已发布</Link>
          </Button>
          <Button asChild variant={type === 'draft' ? 'default' : 'outline'}>
            <Link href="/admin/post/list?type=draft">草稿箱</Link>
          </Button>
          <Button asChild variant={type === 'bin' ? 'default' : 'outline'}>
            <Link href="/admin/post/list?type=bin">回收站</Link>
          </Button>
        </div>
      </div>
      <div className="flex min-h-[calc(100svh-12rem)] flex-1 flex-col gap-4">
        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex gap-2">
            <ConfirmDialog
              title="确认删除"
              description={type === 'bin' ? '这些文章会被永久删除。' : '这些文章会移动到回收站。'}
              disabled={!selectedIds.length}
              onConfirm={batchDelete}
            >
              <Button variant="destructive" disabled={!selectedIds.length}>
                删除
              </Button>
            </ConfirmDialog>
            {type === 'bin' && (
              <ConfirmDialog
                title="确认恢复"
                description="选中的文章会恢复到草稿箱。"
                disabled={!selectedIds.length}
                onConfirm={batchRestore}
              >
                <Button disabled={!selectedIds.length}>恢复</Button>
              </ConfirmDialog>
            )}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              setPageNo(1)
              loadPosts()
            }}
          >
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索标题 / 描述 / 标签"
            />
            <Button type="submit" variant="outline">
              搜索
            </Button>
          </form>
        </div>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={posts.length > 0 && selectedIds.length === posts.length}
                    onCheckedChange={(value) =>
                      setSelectedIds(value ? posts.map((post) => post.id) : [])
                    }
                  />
                </TableHead>
                <TableHead>标题</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>标签</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <AdminTableLoadingRow colSpan={6} className="min-h-[360px]" />
              ) : posts.length ? (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(post.id)}
                        onCheckedChange={(value) =>
                          setSelectedIds((current) =>
                            value ? [...current, post.id] : current.filter((id) => id !== post.id)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="min-w-48 max-w-80">
                      <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
                        <span className="min-w-0 truncate font-medium">{post.title}</span>
                        {post.is_top && (
                          <Badge variant="secondary" className="shrink-0">
                            置顶
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-72 truncate text-muted-foreground">
                      {post.description}
                    </TableCell>
                    <TableCell>
                      {post.category && <Badge variant="secondary">{post.category}</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {type !== 'bin' ? (
                          <>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() =>
                                runAndReload(
                                  () =>
                                    updatePostPublishStatusAPI(
                                      request,
                                      post.id,
                                      type !== 'publish'
                                    ),
                                  type === 'publish' ? '已设为草稿' : '已发布'
                                )
                              }
                            >
                              {type === 'publish' ? '设为草稿' : '发布'}
                            </Button>
                            <Button asChild variant="ghost" size="xs">
                              <Link href={`/admin/post/edit/${post.id}`}>编辑</Link>
                            </Button>
                            <ConfirmDialog
                              title="确认删除"
                              description="文章会移动到回收站。"
                              onConfirm={() =>
                                runAndReload(() => softDeletePostAPI(request, post.id), '删除成功')
                              }
                            >
                              <Button variant="ghost" size="xs">
                                删除
                              </Button>
                            </ConfirmDialog>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() =>
                                runAndReload(() => restorePostAPI(request, post.id), '恢复成功')
                              }
                            >
                              恢复
                            </Button>
                            <ConfirmDialog
                              title="永久删除"
                              description="该操作不可恢复。"
                              onConfirm={() =>
                                runAndReload(() => deletePostAPI(request, post.id), '已永久删除')
                              }
                            >
                              <Button variant="ghost" size="xs">
                                删除
                              </Button>
                            </ConfirmDialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <AdminEmptyState
                      icon={FileTextIcon}
                      title="暂无文章"
                      description="当前筛选条件下没有文章。"
                      className="min-h-[360px]"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <AdminPagination
          page={pageNo}
          pageSize={pageSize}
          total={total}
          onPageChange={setPageNo}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize)
            setPageNo(1)
          }}
        />
      </div>
    </div>
  )
}
