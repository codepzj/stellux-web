import type { CommentTreeNode, CommentVO } from '@/entities/comment/types'

export function buildCommentTree(comments: CommentVO[]): CommentTreeNode[] {
  const topLevelComments: CommentTreeNode[] = []
  const topLevelMap = new Map<string, CommentTreeNode>()

  for (const comment of comments) {
    if (!comment.parent_id) {
      const node = { ...comment, children: [] }
      topLevelComments.push(node)
      topLevelMap.set(comment.id, node)
    }
  }

  for (const comment of comments) {
    if (!comment.parent_id) {
      continue
    }

    const parent = topLevelMap.get(comment.parent_id)
    if (parent) {
      parent.children.push(comment)
    }
  }

  return topLevelComments
}
