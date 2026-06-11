// 文档VO
export interface DocumentVO {
  id: string
  created_at: string
  updated_at: string
  title: string
  description: string
  thumbnail: string
  alias: string
  sort: number
  is_public: boolean
  is_deleted: boolean
}
