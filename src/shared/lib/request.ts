import { Response } from '@/entities/common/dto'

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

  let fullUrl = `${baseUrl}${url}`
  if (params) {
    const query = new URLSearchParams(params).toString()
    fullUrl += `?${query}`
  }

  const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...(revalidate ? { next: { revalidate } } : { cache: cache ?? 'no-store' }),
  }

  try {
    const res = await fetch(fullUrl, fetchOptions)
    const contentType = res.headers.get('content-type') ?? ''

    if (!contentType.includes('application/json')) {
      const text = (await res.text()).trim()
      return {
        code: res.status,
        error: text || res.statusText || 'invalid response',
      } as Response<T>
    }

    return await res.json()
  } catch (err) {
    console.error('request error:', err)
    return { code: 500, error: 'network error' } as Response<T>
  }
}
