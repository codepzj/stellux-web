'use client'

import * as React from 'react'
import { LockIcon, UserIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/ui/input-group'
import { useAdminAuth } from '@/features/admin/components/auth-provider'

export default function AdminLoginPage() {
  const { login } = useAdminAuth()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pending, setPending] = React.useState(false)

  const disabled = pending || !username || !password

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    try {
      await login({ username, password })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '登录失败')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex items-center justify-center pb-2">
          <img
            src="/admin/logo-light.png"
            alt="Stellux Admin"
            className="my-4 h-auto w-36 object-contain dark:hidden"
          />
          <img
            src="/admin/logo-dark.png"
            alt="Stellux Admin"
            className="my-4 hidden h-auto w-36 object-contain dark:block"
          />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="admin-username">用户名</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <UserIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="admin-username"
                    value={username}
                    autoComplete="username"
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="admin-password">密码</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <LockIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="admin-password"
                    type="password"
                    value={password}
                    autoComplete="current-password"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </InputGroup>
              </Field>
              <Button type="submit" disabled={disabled}>
                {pending ? '登录中...' : '登录'}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
