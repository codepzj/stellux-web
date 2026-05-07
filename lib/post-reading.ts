/** 文章页头部用的短日期，如 3月19日 */
export function formatBlogHeaderDate(dateString: string): string {
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return dateString
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

/**
 * 正文字数估算：去掉 fenced / 行内代码后统计非空白字符，接近常见「字数」口径
 */
export function estimateMarkdownCharCount(markdown: string): number {
  const noFences = markdown.replace(/```[\s\S]*?```/g, '')
  const noInline = noFences.replace(/`[^`]*`/g, '')
  return noInline.replace(/\s/g, '').length
}
