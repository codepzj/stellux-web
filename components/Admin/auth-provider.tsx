'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getUserInfoAPI, userLoginAPI, type AdminClient } from '@/lib/admin/api'
import { ADMIN_DEFAULT_PATH, ADMIN_LOGIN_PATH } from '@/lib/admin/routes'
import { adminRequest, isAdminAuthError } from '@/lib/admin/request'
import type { LoginReq, UserInfoVO } from '@/types/admin/user'

const ADMIN_TOKEN_KEY = 'stellux-admin-token'

function readStoredToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ADMIN_TOKEN_KEY)
}

interface AdminAuthContextValue {
  token: string | null
  user: UserInfoVO | null
  isReady: boolean
  request: AdminClient
  login: (data: LoginReq) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AdminAuthContext = React.createContext<AdminAuthContextValue | null>(null)

export function useAdminAuth() {
  const context = React.useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [token, setToken] = React.useState<string | null>(() => readStoredToken())
  const [user, setUser] = React.useState<UserInfoVO | null>(null)
  const [isReady, setIsReady] = React.useState(false)

  const clearAuth = React.useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const logout = React.useCallback(() => {
    clearAuth()
    toast.info('退出成功，请重新登录')
    router.replace(ADMIN_LOGIN_PATH)
  }, [clearAuth, router])

  const request = React.useCallback(
    async <T,>(path: string, options: Parameters<AdminClient>[1] = {}) => {
      const response = await adminRequest<T>(path, {
        ...options,
        token,
      })

      if (isAdminAuthError(response)) {
        clearAuth()
        toast.error(response.error || '登录已过期，请重新登录')
        router.replace(ADMIN_LOGIN_PATH)
        throw new Error(response.error || '登录已过期')
      }

      if (response.code !== 200) {
        throw new Error(response.error || response.msg || '操作失败')
      }

      return response
    },
    [clearAuth, router, token]
  ) as AdminClient

  const refreshUser = React.useCallback(async () => {
    if (!token) return
    const response = await getUserInfoAPI(request)
    setUser(response.data)
  }, [request, token])

  const login = React.useCallback(
    async (data: LoginReq) => {
      const loginResponse = await userLoginAPI((path, options) => adminRequest(path, options), data)

      if (loginResponse.code !== 200) {
        throw new Error(loginResponse.error || loginResponse.msg || '登录失败')
      }

      const nextToken = loginResponse.data.access_token
      localStorage.setItem(ADMIN_TOKEN_KEY, nextToken)
      setToken(nextToken)

      const userResponse = await adminRequest<UserInfoVO>('/admin/user/info', {
        token: nextToken,
      })
      if (userResponse.code === 200) {
        setUser(userResponse.data)
      }

      toast.success('登录成功')
      router.replace(ADMIN_DEFAULT_PATH)
    },
    [router]
  )

  React.useEffect(() => {
    setToken(readStoredToken())
    setIsReady(true)
  }, [])

  React.useEffect(() => {
    if (!isReady) return
    if (!token && pathname !== ADMIN_LOGIN_PATH) {
      router.replace(ADMIN_LOGIN_PATH)
      return
    }
    if (token && pathname === ADMIN_LOGIN_PATH) {
      router.replace(ADMIN_DEFAULT_PATH)
    }
  }, [isReady, pathname, router, token])

  React.useEffect(() => {
    if (isReady && token && !user && pathname !== ADMIN_LOGIN_PATH) {
      refreshUser().catch((error) => {
        if (!readStoredToken()) {
          router.replace(ADMIN_LOGIN_PATH)
          return
        }
        toast.error(error instanceof Error ? error.message : '获取用户信息失败')
      })
    }
  }, [isReady, pathname, refreshUser, router, token, user])

  const value = React.useMemo(
    () => ({
      token,
      user,
      isReady,
      request,
      login,
      logout,
      refreshUser,
    }),
    [isReady, login, logout, refreshUser, request, token, user]
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
