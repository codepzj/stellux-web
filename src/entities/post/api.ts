import { PageVO, PageWithTagName, PageWithCategoryName } from '@/entities/page/types'
import { PostVO } from '@/entities/post/types'
import { request } from '@/shared/lib/request'

// 获取文章列表
export const getPostListAPI = (page: PageWithTagName | PageWithCategoryName) => {
  return request<PageVO<PostVO>>('/post/list', 'GET', {
    params: page as unknown as Record<string, string>,
  })
}

// 根据id获取文章详情
export const getPostDetailByIdAPI = (id: string) => {
  return request<PostVO>(`/post/detail/${id}`)
}

// 根据别名获取文章详情
export const getPostByAliasAPI = (alias: string) => {
  return request<PostVO>(`/post/alias/${alias}`)
}

// 获取所有发布文章
export const getAllPublishPostAPI = () => {
  return request<PostVO[]>('/post/all', 'GET', { revalidate: 60 })
}

// 搜索框获取文章列表
export const getPostByKeyWordAPI = (keyword: string) => {
  return request<PostVO[]>('/post/search', 'GET', { params: { keyword } })
}
