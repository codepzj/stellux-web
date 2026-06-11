import type { PageContent } from '@/entities/page/types'

export const GITHUB_REPO_URL = 'https://github.com/codepzj/stellux-web'

export const HOME_PROFILE: Partial<PageContent> = {
  name: '浩瀚星河',
  avatar: 'https://cdn.jsdelivr.net/gh/codepzj/images@main/20250529174726187.jpeg',
  bio: '浩瀚星河的个人技术博客,记录Golang学习与开发实践。',
  show_recent_posts: true,
  recent_posts_count: 4,
  show_repositories: false,
}
