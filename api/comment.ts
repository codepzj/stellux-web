import { request } from '@/utils/request'
import type { CommentVO, CreateCommentDTO } from '@/types/comment'

export const getCommentListAPI = (postId: string) => {
  return request<CommentVO[]>('/comment/list', 'GET', {
    params: { post_id: postId },
  })
}

export const createCommentAPI = (data: CreateCommentDTO) => {
  return request<CommentVO>('/comment/create', 'POST', { body: data })
}
