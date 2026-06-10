'use client'

import * as React from 'react'
import { UserRoundIcon } from 'lucide-react'
import { toast } from 'sonner'
import { AdminEmptyState } from '@/components/Admin/admin-empty-state'
import { AdminTableLoadingRow } from '@/components/Admin/admin-loading-state'
import { AdminPagination } from '@/components/Admin/admin-pagination'
import { ConfirmDialog } from '@/components/Admin/confirm-dialog'
import { useAdminAuth } from '@/components/Admin/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createUserAPI, deleteUserAPI, getUserListAPI, updateUserAPI } from '@/lib/admin/api'
import type { CreateUserReq, UpdateUserReq, UserInfoVO } from '@/types/admin/user'

const roles: Record<number, string> = {
  0: '管理员',
  1: '普通用户',
  2: '游客',
}

const emptyCreate = (): CreateUserReq => ({
  username: '',
  password: '',
  nickname: '',
  role_id: 1,
  avatar: '',
  email: '',
})

export function UserListPage() {
  const { request } = useAdminAuth()
  const [users, setUsers] = React.useState<UserInfoVO[]>([])
  const [createForm, setCreateForm] = React.useState<CreateUserReq>(emptyCreate)
  const [editForm, setEditForm] = React.useState<UpdateUserReq | null>(null)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [pageNo, setPageNo] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(20)
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadUsers = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await getUserListAPI(request, { page_no: pageNo, page_size: pageSize })
      setUsers(response.data.list)
      setTotal(response.data.total_count)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '加载用户失败')
    } finally {
      setLoading(false)
    }
  }, [pageNo, pageSize, request])

  React.useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const createUser = async () => {
    try {
      await createUserAPI(request, createForm)
      toast.success('创建成功')
      setCreateForm(emptyCreate())
      setCreateOpen(false)
      await loadUsers()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '创建失败')
    }
  }

  const updateUser = async () => {
    if (!editForm) return
    try {
      await updateUserAPI(request, editForm)
      toast.success('修改成功')
      setEditOpen(false)
      setEditForm(null)
      await loadUsers()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '修改失败')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold">用户列表</h1>
          <p className="mt-1 text-sm text-muted-foreground">管理后台用户。</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>新增用户</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增用户</DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel>用户名</FieldLabel>
                <Input
                  value={createForm.username}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, username: event.target.value }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel>密码</FieldLabel>
                <Input
                  type="password"
                  value={createForm.password}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, password: event.target.value }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel>角色</FieldLabel>
                <Select
                  value={String(createForm.role_id)}
                  onValueChange={(value) =>
                    setCreateForm((current) => ({ ...current, role_id: Number(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(roles).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>昵称</FieldLabel>
                <Input
                  value={createForm.nickname}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, nickname: event.target.value }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel>邮箱</FieldLabel>
                <Input
                  value={createForm.email}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel>头像</FieldLabel>
                <Input
                  value={createForm.avatar}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, avatar: event.target.value }))
                  }
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button onClick={createUser}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex min-h-[calc(100svh-12rem)] flex-1 flex-col gap-4">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <AdminTableLoadingRow colSpan={4} className="min-h-[360px]" />
              ) : users.length ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback>
                            {user.nickname?.slice(0, 1) || user.username.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.nickname || user.username}</div>
                          <div className="text-sm text-muted-foreground">{user.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{roles[user.role_id] ?? user.role_id}</Badge>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setEditForm({
                              id: user.id,
                              nickname: user.nickname,
                              avatar: user.avatar,
                              email: user.email,
                            })
                            setEditOpen(true)
                          }}
                        >
                          编辑
                        </Button>
                        <ConfirmDialog
                          title="删除用户"
                          description="删除后不可恢复。"
                          onConfirm={async () => {
                            await deleteUserAPI(request, user.id)
                            toast.success('删除成功')
                            await loadUsers()
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
                  <TableCell colSpan={4} className="p-0">
                    <AdminEmptyState
                      icon={UserRoundIcon}
                      title="暂无用户"
                      description="创建用户后会显示在这里。"
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
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑用户</DialogTitle>
            </DialogHeader>
            {editForm && (
              <FieldGroup>
                <Field>
                  <FieldLabel>昵称</FieldLabel>
                  <Input
                    value={editForm.nickname}
                    onChange={(event) =>
                      setEditForm(
                        (current) => current && { ...current, nickname: event.target.value }
                      )
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel>邮箱</FieldLabel>
                  <Input
                    value={editForm.email}
                    onChange={(event) =>
                      setEditForm((current) => current && { ...current, email: event.target.value })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel>头像</FieldLabel>
                  <Input
                    value={editForm.avatar}
                    onChange={(event) =>
                      setEditForm(
                        (current) => current && { ...current, avatar: event.target.value }
                      )
                    }
                  />
                </Field>
              </FieldGroup>
            )}
            <DialogFooter>
              <Button onClick={updateUser}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
