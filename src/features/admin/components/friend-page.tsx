'use client'

import * as React from 'react'
import { UsersRoundIcon } from 'lucide-react'
import { toast } from 'sonner'
import { AdminEmptyState } from '@/features/admin/components/admin-empty-state'
import { AdminTableLoadingRow } from '@/features/admin/components/admin-loading-state'
import { AdminPagination } from '@/features/admin/components/admin-pagination'
import { ConfirmDialog } from '@/features/admin/components/confirm-dialog'
import { useAdminAuth } from '@/features/admin/components/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Switch } from '@/shared/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import {
  createFriendAPI,
  deleteFriendAPI,
  getFriendListAPI,
  updateFriendAPI,
} from '@/entities/admin/api'
import type { FriendCreateReq, FriendUpdateReq, FriendVO } from '@/entities/admin/types/friend'

const websiteTypes = [
  { value: 0, label: '技术' },
  { value: 1, label: '生活' },
  { value: 2, label: '工具' },
  { value: 3, label: '其他' },
]

const emptyFriend = (): FriendUpdateReq => ({
  id: '',
  name: '',
  description: '',
  site_url: '',
  avatar_url: '',
  website_type: 0,
  is_active: true,
})

export function FriendPage() {
  const { request } = useAdminAuth()
  const [friends, setFriends] = React.useState<FriendVO[]>([])
  const [form, setForm] = React.useState<FriendUpdateReq>(emptyFriend)
  const [open, setOpen] = React.useState(false)
  const [pageNo, setPageNo] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(20)
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const isEdit = Boolean(form.id)

  const loadFriends = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await getFriendListAPI(request, { page_no: pageNo, page_size: pageSize })
      setFriends(response.data.list)
      setTotal(response.data.total_count)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '加载友链失败')
    } finally {
      setLoading(false)
    }
  }, [pageNo, pageSize, request])

  React.useEffect(() => {
    loadFriends()
  }, [loadFriends])

  const updateForm = <K extends keyof FriendUpdateReq>(key: K, value: FriendUpdateReq[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const submit = async () => {
    try {
      if (isEdit) {
        await updateFriendAPI(request, form)
        toast.success('编辑成功')
      } else {
        const payload: FriendCreateReq = form
        await createFriendAPI(request, payload)
        toast.success('创建成功')
      }
      setOpen(false)
      setForm(emptyFriend())
      await loadFriends()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold">友链</h1>
          <p className="mt-1 text-sm text-muted-foreground">管理友情链接。</p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) setForm(emptyFriend())
          }}
        >
          <DialogTrigger asChild>
            <Button>新增</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEdit ? '编辑友链' : '新增友链'}</DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel>名称</FieldLabel>
                <Input
                  value={form.name}
                  onChange={(event) => updateForm('name', event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>描述</FieldLabel>
                <Input
                  value={form.description}
                  onChange={(event) => updateForm('description', event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>站点 URL</FieldLabel>
                <Input
                  value={form.site_url}
                  onChange={(event) => updateForm('site_url', event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>头像 URL</FieldLabel>
                <Input
                  value={form.avatar_url}
                  onChange={(event) => updateForm('avatar_url', event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>网站类型</FieldLabel>
                <Select
                  value={String(form.website_type)}
                  onValueChange={(value) => updateForm('website_type', Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {websiteTypes.map((type) => (
                        <SelectItem key={type.value} value={String(type.value)}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              {isEdit && (
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={form.is_active}
                    onCheckedChange={(value) => updateForm('is_active', value)}
                  />
                  激活
                </label>
              )}
            </FieldGroup>
            <DialogFooter>
              <Button onClick={submit}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex min-h-[calc(100svh-12rem)] flex-1 flex-col gap-4">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>站点</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <AdminTableLoadingRow colSpan={5} className="min-h-[360px]" />
              ) : friends.length ? (
                friends.map((friend) => (
                  <TableRow key={friend.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={friend.avatar_url} alt={friend.name} />
                          <AvatarFallback>{friend.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{friend.name}</div>
                          <div className="max-w-56 truncate text-sm text-muted-foreground">
                            {friend.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={friend.site_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline"
                      >
                        {friend.site_url}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {websiteTypes.find((type) => type.value === friend.website_type)?.label ??
                          '其他'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={friend.is_active ? 'default' : 'secondary'}>
                        {friend.is_active ? '启用' : '停用'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setForm({ ...friend })
                            setOpen(true)
                          }}
                        >
                          编辑
                        </Button>
                        <ConfirmDialog
                          title="删除友链"
                          description="删除后不可恢复。"
                          onConfirm={async () => {
                            await deleteFriendAPI(request, friend.id)
                            toast.success('删除成功')
                            await loadFriends()
                          }}
                        >
                          <Button variant="ghost" size="xs">
                            删除
                          </Button>
                        </ConfirmDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="p-0">
                    <AdminEmptyState
                      icon={UsersRoundIcon}
                      title="暂无友链"
                      description="添加友情链接后会显示在这里。"
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
