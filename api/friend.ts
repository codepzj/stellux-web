import { request } from '@/utils/request'

export type FriendShowVO = {
  name: string
  description: string
  site_url: string
  avatar_url: string
  website_type: number
}

export type FriendVO = FriendShowVO & {
  id: string
  is_active: boolean
}

export type CreateFriendDTO = {
  name: string
  description: string
  site_url: string
  avatar_url: string
  website_type: number
}

export type UpdateFriendDTO = CreateFriendDTO & {
  id: string
  is_active: boolean
}

export const getFriendListAPI = () => {
  return request<FriendShowVO[]>('/friend/list')
}

export const createFriendAPI = (data: CreateFriendDTO) => {
  return request<null>('/friend/create', 'POST', { body: data })
}
