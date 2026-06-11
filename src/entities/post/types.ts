export interface PostVO {
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
