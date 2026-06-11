import { DocumentContentVO } from '@/entities/document/content-types'
import { LucideIcon } from 'lucide-react'

export interface DocTreeItem {
  id: string
  title: string
  url: string
  sort: number
  created_at: string
  isDir: boolean
  icon?: LucideIcon
  isActive?: boolean
  items?: DocTreeItem[]
}

// 将文档内容列表转换为文档树结构，并根据 sort、created_at 字段同级升序排序
export function convertToDocumentTreeData(data: DocumentContentVO[], alias: string): DocTreeItem[] {
  const map = new Map<string, DocTreeItem>()

  if (!data) {
    return []
  }

  // 先创建所有节点
  for (const doc of data) {
    map.set(doc.id, {
      id: doc.id,
      title: doc.title,
      url: `/document/${alias}/${doc.alias}`,
      sort: doc.sort,
      created_at: doc.created_at,
      isDir: doc.is_dir,
    })
  }

  const tree: DocTreeItem[] = []
  for (const doc of data) {
    const node = map.get(doc.id)!
    // 如果 parent_id 为空或者等于 document_id，说明是根节点
    if (!doc.parent_id || doc.parent_id === doc.document_id || !map.has(doc.parent_id)) {
      tree.push(node)
    } else {
      const parent = map.get(doc.parent_id)!
      if (!parent.items) parent.items = []
      parent.items.push(node)
    }
  }

  // 递归排序函数，先按 sort 升序，再按 created_at 升序
  function sortTree(items: DocTreeItem[]) {
    items.sort((a, b) => {
      if ((a.sort ?? 0) !== (b.sort ?? 0)) {
        return (a.sort ?? 0) - (b.sort ?? 0)
      }
      // created_at 升序
      if (a.created_at < b.created_at) return -1
      if (a.created_at > b.created_at) return 1
      return 0
    })
    for (const item of items) {
      if (item.items && item.items.length > 0) {
        sortTree(item.items)
      }
    }
  }

  sortTree(tree)

  return tree
}
