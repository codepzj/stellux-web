/**
 * 格式化日期
 * @param dateString 日期字符串
 * @returns 格式化后的日期字符串，如：2023-12-15
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  } catch (error) {
    console.error('日期格式化错误:', error)
    return dateString
  }
}

/**
 * 格式化为相对时间
 * @param dateString 日期字符串
 * @returns 相对时间，如：3天前、2小时前
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()

    // 转换为秒
    const diffSec = Math.floor(diffMs / 1000)

    if (diffSec < 60) {
      return `${diffSec}秒前`
    }

    // 转换为分钟
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) {
      return `${diffMin}分钟前`
    }

    // 转换为小时
    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) {
      return `${diffHour}小时前`
    }

    // 转换为天
    const diffDay = Math.floor(diffHour / 24)
    if (diffDay < 30) {
      return `${diffDay}天前`
    }

    // 转换为月
    const diffMonth = Math.floor(diffDay / 30)
    if (diffMonth < 12) {
      return `${diffMonth}个月前`
    }

    // 转换为年
    const diffYear = Math.floor(diffMonth / 12)
    return `${diffYear}年前`
  } catch (error) {
    console.error('相对时间格式化错误:', error)
    return dateString
  }
}
