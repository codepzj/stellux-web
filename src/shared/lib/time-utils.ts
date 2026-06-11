/**
 * 时间格式化工具函数
 */

/**
 * 估算阅读时间
 * @param content 文本内容
 * @returns 估算的阅读时间（分钟）
 */
export function estimateReadingTime(content: string): number {
  // 移除 Markdown 语法标记
  const cleanContent = content
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
    .replace(/`(.*?)`/g, '$1') // 移除行内代码标记
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .replace(/\n+/g, ' ') // 将换行符替换为空格
    .trim()

  // 按中文字符和英文单词计算
  const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = cleanContent
    .split(/\s+/)
    .filter((word) => word.length > 0 && !/[\u4e00-\u9fa5]/.test(word)).length

  // 中文阅读速度：每分钟约300字，英文阅读速度：每分钟约200词
  const chineseReadingTime = chineseChars / 300
  const englishReadingTime = englishWords / 200

  const totalTime = chineseReadingTime + englishReadingTime

  // 最少1分钟，向上取整
  return Math.max(1, Math.ceil(totalTime))
}

/**
 * 格式化时间为相对时间（如：2天前、1小时前等）
 * @param dateString ISO 时间字符串
 * @returns 格式化的相对时间字符串
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return '刚刚'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}小时前`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays}天前`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears}年前`
}

/**
 * 格式化时间为标准日期格式
 * @param dateString ISO 时间字符串
 * @returns 格式化的日期字符串 (YYYY-MM-DD)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * 格式化时间为完整日期时间格式
 * @param dateString ISO 时间字符串
 * @returns 格式化的日期时间字符串
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
