import type { Response } from '@/types/admin/dto'

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_PROJECT_API

export interface AdminRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: object
  body?: unknown
  token?: string | null
  baseUrl?: string
}

export class AdminRequestError extends Error {
  response: Response<unknown>

  constructor(response: Response<unknown>) {
    super(response.error || response.msg || '操作失败')
    this.name = 'AdminRequestError'
    this.response = response
  }
}

export function isAdminAuthError(response: Pick<Response<unknown>, 'code'>): boolean {
  return response.code === 401
}

export async function adminRequest<T>(
  path: string,
  options: AdminRequestOptions = {}
): Promise<Response<T>> {
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_PROJECT_API is not set')
  }

  const url = new URL(path, baseUrl)
  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: 'no-store',
  })

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return {
      code: response.status,
      error: (await response.text()).trim() || response.statusText,
      data: undefined as T,
    }
  }

  return response.json() as Promise<Response<T>>
}
