import type { PageReq } from './dto'

export interface CommentVO {
  id: string
  created_at: string
  updated_at: string
  post_id: string
  post_title: string
  post_alias: string
  parent_id: string | null
  device_id: string
  nickname: string
  avatar: string
  email: string
  website: string
  user_agent: string
  content: string
}

export interface CommentListReq extends PageReq {
  post_id?: string
}

export interface CommentCreateReq {
  post_id: string
  parent_id?: string
  nickname: string
  avatar: string
  email: string
  website: string
  content: string
}

export interface CommentUpdateReq {
  id: string
  nickname: string
  avatar: string
  email: string
  website: string
  content: string
}
