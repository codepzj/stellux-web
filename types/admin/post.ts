import type { PageReq } from './dto'

export interface PostReq {
  id?: string
  created_at?: string
  title: string
  content: string
  description: string
  alias: string
  category_id?: string
  tags_id?: string[]
  is_top: boolean
  is_publish: boolean
  thumbnail: string
}

export interface PostVO {
  id: string
  created_at: string
  title: string
  content: string
  description: string
  alias: string
  category_id: string
  tags_id: string[]
  is_publish: boolean
  is_top: boolean
  thumbnail: string
}

export interface PostDetailVO {
  id: string
  created_at: string
  updated_at: string
  title: string
  content: string
  description: string
  alias: string
  category: string
  tags: string[]
  thumbnail: string
  is_top: boolean
  is_publish: boolean
}

export interface PostPageReq extends PageReq {
  post_type: 'publish' | 'draft' | 'bin'
}

export type PostListType = PostPageReq['post_type']
