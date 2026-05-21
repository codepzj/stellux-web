/** Markdown 含二级或三级标题时可生成 TOC（允许 ## 后无空格） */
const H2_OR_H3_HEADING = /^#{2,3}(?:\s|[^\s#])/m

export function hasTocHeadings(content: string): boolean {
  if (!content?.trim()) return false
  return H2_OR_H3_HEADING.test(content)
}
