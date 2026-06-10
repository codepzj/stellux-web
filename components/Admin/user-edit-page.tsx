'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAdminAuth } from '@/components/Admin/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { updateUserAPI, updateUserPasswordAPI } from '@/lib/admin/api'

export function UserEditTabs({ active }: { active: 'basic' | 'reset-password' }) {
  const router = useRouter()

  return (
    <Tabs value={active}>
      <TabsList>
        <TabsTrigger value="basic" onClick={() => router.push('/admin/user/edit/basic')}>
          基本信息
        </TabsTrigger>
        <TabsTrigger
          value="reset-password"
          onClick={() => router.push('/admin/user/edit/reset-password')}
        >
          重置密码
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export function UserBasicPage() {
  const { request, user, refreshUser } = useAdminAuth()
  const [form, setForm] = React.useState({ nickname: '', email: '', avatar: '' })

  React.useEffect(() => {
    if (user) {
      setForm({ nickname: user.nickname, email: user.email, avatar: user.avatar })
    }
  }, [user])

  const submit = async () => {
    if (!user) return
    try {
      await updateUserAPI(request, { id: user.id, ...form })
      toast.success('更新成功')
      await refreshUser()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '更新失败')
    }
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-base font-semibold">编辑资料</h1>
      </div>
      <div className="flex flex-col gap-6">
        <UserEditTabs active="basic" />
        <FieldGroup>
          <Field>
            <FieldLabel>昵称</FieldLabel>
            <Input value={form.nickname} onChange={event => setForm(current => ({ ...current, nickname: event.target.value }))} />
          </Field>
          <Field>
            <FieldLabel>邮箱</FieldLabel>
            <Input value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} />
          </Field>
          <Field>
            <FieldLabel>头像</FieldLabel>
            <div className="flex items-center gap-3">
              <Avatar className="size-16">
                <AvatarImage src={form.avatar} alt={form.nickname} />
                <AvatarFallback>{form.nickname?.slice(0, 1) || 'U'}</AvatarFallback>
              </Avatar>
              <Input value={form.avatar} onChange={event => setForm(current => ({ ...current, avatar: event.target.value }))} />
            </div>
          </Field>
          <Button className="w-fit" onClick={submit}>提交</Button>
        </FieldGroup>
      </div>
    </div>
  )
}

export function ResetPasswordPage() {
  const { request, user } = useAdminAuth()
  const [form, setForm] = React.useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })

  const submit = async () => {
    if (!user) return
    if (form.new_password !== form.confirm_password) {
      toast.warning('两次输入的新密码不一致')
      return
    }
    try {
      await updateUserPasswordAPI(request, {
        id: user.id,
        old_password: form.old_password,
        new_password: form.new_password,
      })
      toast.success('密码重置成功')
      setForm({ old_password: '', new_password: '', confirm_password: '' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '重置失败')
    }
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-base font-semibold">重置密码</h1>
      </div>
      <div className="flex flex-col gap-6">
        <UserEditTabs active="reset-password" />
        <FieldGroup>
          <Field>
            <FieldLabel>旧密码</FieldLabel>
            <Input
              type="password"
              value={form.old_password}
              onChange={event => setForm(current => ({ ...current, old_password: event.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel>新密码</FieldLabel>
            <Input
              type="password"
              value={form.new_password}
              onChange={event => setForm(current => ({ ...current, new_password: event.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel>重复新密码</FieldLabel>
            <Input
              type="password"
              value={form.confirm_password}
              onChange={event => setForm(current => ({ ...current, confirm_password: event.target.value }))}
            />
          </Field>
          <Button className="w-fit" onClick={submit}>重置密码</Button>
        </FieldGroup>
      </div>
    </div>
  )
}
