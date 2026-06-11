// 文档内容VO
export interface DocumentContentVO {
  id: string
  created_at: string
  updated_at: string
  document_id: string
  title: string
  content: string
  description: string
  alias: string
  parent_id: string
  is_dir: boolean
  sort: number
}
