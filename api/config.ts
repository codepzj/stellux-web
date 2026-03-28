import { request } from '@/utils/request'
import type { ConfigMapVO } from '@/types/config'

export const getConfigMapAPI = () =>
  request<ConfigMapVO>('/config/map', 'GET', { revalidate: 300, cache: 'force-cache' })
