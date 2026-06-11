import { request } from '@/shared/lib/request'
import type { CommentVO, CreateCommentDTO } from '@/entities/comment/types'

export const getCommentListAPI = (postId: string) => {
  return request<CommentVO[]>('/comment/list', 'GET', {
    params: { post_id: postId },
  })
}

export const createCommentAPI = (data: CreateCommentDTO) => {
  return request<CommentVO>('/comment/create', 'POST', { body: data })
}
