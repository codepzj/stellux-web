import { request } from '@/shared/lib/request'
import { DocumentVO } from '@/entities/document/types'

// 获取全部公开文档
export const getAllPublicDocument = () => {
  return request<DocumentVO[]>('/document/all')
}

// 根据id获取根文档
export const getDocumentById = (id: string) => {
  return request<DocumentVO>(`/document/${id}`)
}

// 根据alias获取文档
export const getDocumentByAlias = (alias: string) => {
  return request<DocumentVO>(`/document/alias/${alias}`)
}
