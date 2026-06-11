export interface DocumentRootRequest {
  title: string
  alias: string
  description: string
  thumbnail: string
  document_type: string
  is_public: boolean
  sort: number
}

export interface DocumentRootEditRequest extends DocumentRootRequest {
  id: string
}

export interface DocumentRootVO {
  id: string
  created_at: string
  updated_at: string
  deleted_at?: string
  title: string
  alias: string
  description: string
  thumbnail: string
  is_public: boolean
  is_deleted: boolean
  sort: number
}

export interface DocumentContentRequest {
  document_id: string
  title: string
  content: string
  description: string
  alias: string
  parent_id: string
  is_dir: boolean
  sort: number
}

export interface DocumentContentEditRequest extends DocumentContentRequest {
  id: string
}

export interface DocumentContentVO extends DocumentContentEditRequest {
  like_count: number
  dislike_count: number
  comment_count: number
  is_deleted: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface DocumentTreeVO {
  id: string
  created_at: string
  updated_at: string
  title: string
  alias: string
  document_type?: string
  is_dir: boolean
  is_public?: boolean
  parent_id: string
  document_id: string
  sort: number
  children?: DocumentTreeVO[]
}
