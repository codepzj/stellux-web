import { Response } from '@/types/dto'

const baseUrl = process.env.NEXT_PUBLIC_PROJECT_API

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_PROJECT_API is not set')
}

interface RequestOptions {
  params?: Record<string, string>
  body?: unknown
  cache?: RequestCache
  revalidate?: number
}

export async function request<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  options: RequestOptions = {}
): Promise<Response<T>> {
  const { params, body, cache, revalidate } = options

  // 构建 URL
  let fullUrl = `${baseUrl}${url}`
  if (params) {
    const query = new URLSearchParams(params).toString()
    fullUrl += `?${query}`
  }

  // 请求配置
  const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...(revalidate ? { next: { revalidate } } : { cache: cache ?? 'no-store' }),
  }

  try {
    const res = await fetch(fullUrl, fetchOptions)
    return await res.json()
  } catch (err) {
    console.error('request error:', err)
    return { code: 500, error: 'network error' } as Response<T>
  }
}
