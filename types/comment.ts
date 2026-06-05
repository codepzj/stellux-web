export interface CommentVO {
  id: string
  created_at: string
  updated_at: string
  post_id: string
  parent_id: string | null
  device_id: string
  nickname: string
  avatar: string
  email: string
  website: string
  user_agent: string
  content: string
}

export type CommentTreeNode = CommentVO & {
  children: CommentVO[]
}

export interface CreateCommentDTO {
  post_id: string
  parent_id?: string | null
  device_id: string
  nickname: string
  avatar?: string
  email: string
  website?: string
  content: string
}
