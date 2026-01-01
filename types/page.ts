// 请求分页携带的params
export interface Page {
  page_no: number
  page_size: number
  field?: string
  order?: 'ASC' | 'DESC'
  keyword?: string
}

// 分页后返回的data的数据类型
export interface PageVO<T> {
  page_no: number
  size: number
  field: string
  order: 'ASC' | 'DESC'
  total_count: number
  total_page: number
  list: T[]
}

// 请求分页携带的params，包含标签名称
export interface PageWithTagName extends Page {
  label_name?: string
}

// 请求分页携带的params，包含分类名称
export interface PageWithCategoryName extends Page {
  category_name?: string
}

// 页面配置VO
export interface PageConfigVO {
  id: string
  created_at: string
  updated_at: string
  type: 'home' | 'about' | 'seo'
  content: PageContent
  is_active: boolean
}

// 页面内容
export interface PageContent {
  // 通用配置
  title: string
  description: string

  // 主页配置
  avatar?: string
  name?: string
  bio?: string
  github?: string
  blog?: string
  location?: string
  tech_stacks?: string[]
  repositories?: Repo[]
  quote?: string
  motto?: string
  show_recent_posts?: boolean
  recent_posts_count?: number
  show_repositories?: boolean

  // About页面配置
  skills?: Skill[]
  timeline?: Timeline[]
  interests?: string[]
  focus_items?: string[]

  // SEO配置
  seo_title?: string
  seo_keywords?: string[]
  seo_description?: string
  seo_author?: string
  robots_meta?: string
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_card?: string
}

// 开源项目
export interface Repo {
  name: string
  url: string
  desc: string
}

// 技能
export interface Skill {
  category: string
  items: string[]
}

// 时间线项目
export interface Timeline {
  year: string
  title: string
  desc: string
}
