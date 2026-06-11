import { DocumentContentVO } from '@/entities/document/content-types'
import { request } from '@/shared/lib/request'

// 根据id获取文档内容
export const getDocumentContentById = (id: string) => {
  return request<DocumentContentVO>(`/document-content/${id}`)
}

// 根据文档id获取所有文档内容
export const getAllDocumentContentByDocumentId = (id: string) => {
  return request<DocumentContentVO[]>('/document-content/all', 'GET', {
    params: { document_id: id },
  })
}
