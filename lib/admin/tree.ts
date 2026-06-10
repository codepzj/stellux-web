import type { DocumentTreeVO } from '@/types/admin/document'

export type AdminTreeNode = DocumentTreeVO & {
  children?: AdminTreeNode[]
}

export function buildDocumentTree(rows: DocumentTreeVO[]): AdminTreeNode[] {
  const nodeMap = new Map<string, AdminTreeNode>()
  const roots: AdminTreeNode[] = []

  for (const row of rows) {
    nodeMap.set(row.id, { ...row, children: [] })
  }

  for (const node of nodeMap.values()) {
    const parent = nodeMap.get(node.parent_id)
    if (parent && parent.id !== node.id) {
      parent.children = parent.children ?? []
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  }

  const sortTree = (nodes: AdminTreeNode[]) => {
    nodes.sort((a, b) => a.sort - b.sort || a.title.localeCompare(b.title, 'zh-CN'))
    for (const node of nodes) {
      if (node.children?.length) {
        sortTree(node.children)
      } else {
        delete node.children
      }
    }
  }

  sortTree(roots)
  return roots
}

export function getDescendantIds(rows: DocumentTreeVO[], parentId: string): string[] {
  const childrenByParent = new Map<string, DocumentTreeVO[]>()
  for (const row of rows) {
    childrenByParent.set(row.parent_id, [...(childrenByParent.get(row.parent_id) ?? []), row])
  }

  const descendants: string[] = []
  const visit = (id: string) => {
    for (const child of childrenByParent.get(id) ?? []) {
      descendants.push(child.id)
      visit(child.id)
    }
  }

  visit(parentId)
  return descendants
}

export function buildDirectoryOptions(rows: DocumentTreeVO[], excludeId?: string): AdminTreeNode[] {
  const excluded = new Set(excludeId ? [excludeId, ...getDescendantIds(rows, excludeId)] : [])
  return buildDocumentTree(rows.filter(row => row.is_dir && !excluded.has(row.id)))
}

export function getNextSort(rows: DocumentTreeVO[], parentId: string): number {
  return rows.filter(row => row.parent_id === parentId).length + 1
}
