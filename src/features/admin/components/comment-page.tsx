'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  EyeIcon,
  MessageSquareTextIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { toast } from 'sonner'
import { AdminEmptyState } from '@/features/admin/components/admin-empty-state'
import { AdminTableLoadingRow } from '@/features/admin/components/admin-loading-state'
import { AdminPagination } from '@/features/admin/components/admin-pagination'
import { ConfirmDialog } from '@/features/admin/components/confirm-dialog'
import { useAdminAuth } from '@/features/admin/components/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { Textarea } from '@/shared/ui/textarea'
import {
  createCommentAdminAPI,
  deleteCommentAPI,
  getCommentListAdminAPI,
  updateCommentAPI,
} from '@/entities/admin/api'
import type { CommentCreateReq, CommentUpdateReq, CommentVO } from '@/entities/admin/types/comment'

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

function toUpdateForm(comment: CommentVO): CommentUpdateReq {
  return {
    id: comment.id,
    nickname: comment.nickname,
    avatar: comment.avatar,
    email: comment.email,
    website: comment.website,
    content: comment.content,
  }
}

function emptyCreateForm(): CommentCreateReq {
  return {
    post_id: '',
    parent_id: '',
    nickname: '',
    avatar: '',
    email: '',
    website: '',
    content: '',
  }
}

function formatDateTime(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date)
}

function shortID(value: string) {
  return value.length > 10 ? `${value.slice(0, 6)}...${value.slice(-4)}` : value
}

export function CommentPage() {
  const { request } = useAdminAuth()
  const [comments, setComments] = React.useState<CommentVO[]>([])
  const [keywordInput, setKeywordInput] = React.useState('')
  const [postIdInput, setPostIdInput] = React.useState('')
  const [keyword, setKeyword] = React.useState('')
  const [postId, setPostId] = React.useState('')
  const [pageNo, setPageNo] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(20)
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [createForm, setCreateForm] = React.useState<CommentCreateReq>(() => emptyCreateForm())
  const [editForm, setEditForm] = React.useState<CommentUpdateReq | null>(null)

  const loadComments = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await getCommentListAdminAPI(request, {
        page_no: pageNo,
        page_size: pageSize,
        keyword,
        post_id: postId,
      })
      setComments(response.data.list)
      setTotal(response.data.total_count)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '加载评论失败')
    } finally {
      setLoading(false)
    }
  }, [keyword, pageNo, pageSize, postId, request])

  React.useEffect(() => {
    loadComments()
  }, [loadComments])

  const updateForm = <K extends keyof CommentUpdateReq>(key: K, value: CommentUpdateReq[K]) => {
    setEditForm((current) => (current ? { ...current, [key]: value } : current))
  }

  const updateCreateForm = <K extends keyof CommentCreateReq>(
    key: K,
    value: CommentCreateReq[K]
  ) => {
    setCreateForm((current) => ({ ...current, [key]: value }))
  }

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setKeyword(keywordInput.trim())
    setPostId(postIdInput.trim())
    setPageNo(1)
  }

  const submitCreate = async () => {
    try {
      await createCommentAdminAPI(request, createForm)
      toast.success('评论已创建')
      setCreateOpen(false)
      setCreateForm(emptyCreateForm())
      await loadComments()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '创建评论失败')
    }
  }

  const submitEdit = async () => {
    if (!editForm) return
    try {
      await updateCommentAPI(request, editForm)
      toast.success('评论已更新')
      setEditForm(null)
      await loadComments()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存评论失败')
    }
  }

  const deleteComment = async (comment: CommentVO) => {
    try {
      await deleteCommentAPI(request, comment.id)
      toast.success('评论已删除')
      await loadComments()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除评论失败')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold">评论</h1>
          <p className="mt-1 text-sm text-muted-foreground">查看和管理站点访客评论。</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon data-icon="inline-start" />
          新增
        </Button>
      </div>
      <div className="flex min-h-[calc(100svh-12rem)] flex-1 flex-col gap-4">
        <form className="flex flex-wrap justify-end gap-2" onSubmit={submitSearch}>
          <Input
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            placeholder="搜索昵称 / 邮箱 / 内容 / 设备"
            className="w-full sm:w-72"
          />
          <Input
            value={postIdInput}
            onChange={(event) => setPostIdInput(event.target.value)}
            placeholder="文章 ID"
            className="w-full sm:w-64"
          />
          <Button type="submit" variant="outline">
            <SearchIcon data-icon="inline-start" />
            搜索
          </Button>
        </form>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>评论者</TableHead>
                <TableHead>内容</TableHead>
                <TableHead>关联</TableHead>
                <TableHead>联系</TableHead>
                <TableHead>设备</TableHead>
                <TableHead>时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <AdminTableLoadingRow colSpan={7} className="min-h-[360px]" />
              ) : comments.length ? (
                comments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell className="min-w-48">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={comment.avatar} alt={comment.nickname} />
                          <AvatarFallback>{comment.nickname.slice(0, 1) || '评'}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate font-medium">{comment.nickname}</div>
                          <div className="font-mono text-xs text-muted-foreground">
                            {shortID(comment.id)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-96">
                      <div className="line-clamp-2 text-sm">{comment.content}</div>
                    </TableCell>
                    <TableCell className="min-w-52">
                      <div className="flex flex-col gap-1">
                        {comment.post_alias ? (
                          <Link
                            href={`/blog/${comment.post_alias}`}
                            target="_blank"
                            className="max-w-56 truncate text-sm font-medium underline"
                          >
                            {comment.post_title || shortID(comment.post_id)}
                          </Link>
                        ) : (
                          <div className="font-mono text-xs text-muted-foreground">
                            文章 {shortID(comment.post_id)}
                          </div>
                        )}
                        <Badge variant={comment.parent_id ? 'outline' : 'secondary'}>
                          {comment.parent_id ? `回复 ${shortID(comment.parent_id)}` : '主评论'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-56">
                      <div className="flex flex-col gap-1 text-sm">
                        <a href={`mailto:${comment.email}`} className="max-w-44 truncate">
                          {comment.email}
                        </a>
                        {comment.website && (
                          <a
                            href={comment.website}
                            target="_blank"
                            rel="noreferrer"
                            className="max-w-44 truncate text-muted-foreground underline"
                          >
                            {comment.website}
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-64">
                      <div className="flex flex-col gap-1">
                        <div className="font-mono text-xs text-muted-foreground">
                          {shortID(comment.device_id)}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {comment.user_agent}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-36 text-sm text-muted-foreground">
                      {formatDateTime(comment.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="xs">
                          <Link href={`/admin/comment/${comment.id}`}>
                            <EyeIcon data-icon="inline-start" />
                            查看
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setEditForm(toUpdateForm(comment))}
                        >
                          <PencilIcon data-icon="inline-start" />
                          编辑
                        </Button>
                        <ConfirmDialog
                          title="删除评论"
                          description="删除后该评论不会再出现在文章评论区。"
                          onConfirm={() => deleteComment(comment)}
                        >
                          <Button variant="ghost" size="xs">
                            <Trash2Icon data-icon="inline-start" />
                            删除
                          </Button>
                        </ConfirmDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <AdminEmptyState
                      icon={MessageSquareTextIcon}
                      title="暂无评论"
                      description="当前筛选条件下没有评论。"
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

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open)
          if (!open) setCreateForm(emptyCreateForm())
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增评论</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>文章 ID</FieldLabel>
              <Input
                value={createForm.post_id}
                onChange={(event) => updateCreateForm('post_id', event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>父评论 ID</FieldLabel>
              <Input
                value={createForm.parent_id}
                onChange={(event) => updateCreateForm('parent_id', event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>昵称</FieldLabel>
              <Input
                value={createForm.nickname}
                onChange={(event) => updateCreateForm('nickname', event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>头像 URL</FieldLabel>
              <Input
                value={createForm.avatar}
                onChange={(event) => updateCreateForm('avatar', event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>邮箱</FieldLabel>
              <Input
                value={createForm.email}
                onChange={(event) => updateCreateForm('email', event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>站点</FieldLabel>
              <Input
                value={createForm.website}
                onChange={(event) => updateCreateForm('website', event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>内容</FieldLabel>
              <Textarea
                value={createForm.content}
                onChange={(event) => updateCreateForm('content', event.target.value)}
                className="min-h-32"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button onClick={submitCreate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editForm)} onOpenChange={(open) => !open && setEditForm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑评论</DialogTitle>
          </DialogHeader>
          {editForm && (
            <FieldGroup>
              <Field>
                <FieldLabel>昵称</FieldLabel>
                <Input
                  value={editForm.nickname}
                  onChange={(event) => updateForm('nickname', event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>头像 URL</FieldLabel>
                <Input
                  value={editForm.avatar}
                  onChange={(event) => updateForm('avatar', event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>邮箱</FieldLabel>
                <Input
                  value={editForm.email}
                  onChange={(event) => updateForm('email', event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>站点</FieldLabel>
                <Input
                  value={editForm.website}
                  onChange={(event) => updateForm('website', event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>内容</FieldLabel>
                <Textarea
                  value={editForm.content}
                  onChange={(event) => updateForm('content', event.target.value)}
                  className="min-h-32"
                />
              </Field>
            </FieldGroup>
          )}
          <DialogFooter>
            <Button onClick={submitEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
