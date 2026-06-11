'use client'

import { buildCommentTree } from '@/entities/comment/tree'
import type { CommentVO, CreateCommentDTO } from '@/entities/comment/types'
import { CommentForm } from './comment-form'
import { CommentItem } from './comment-item'

type Props = {
  postId: string
  comments: CommentVO[]
  replyTarget: CommentVO | null
  onReply: (comment: CommentVO) => void
  onCancelReply: () => void
  onSubmit: (data: CreateCommentDTO) => Promise<boolean>
}

export function CommentList({
  postId,
  comments,
  replyTarget,
  onReply,
  onCancelReply,
  onSubmit,
}: Props) {
  const tree = buildCommentTree(comments)

  return (
    <div className="space-y-5">
      {tree.map((comment) => (
        <div key={comment.id}>
          <CommentItem comment={comment} onReply={onReply}>
            {replyTarget?.id === comment.id ? (
              <CommentForm
                compact
                postId={postId}
                replyTarget={replyTarget}
                onCancelReply={onCancelReply}
                onSubmit={onSubmit}
              />
            ) : null}
          </CommentItem>

          {comment.children.length > 0 ? (
            <div className="ml-[2.75rem] mt-3 space-y-4">
              {comment.children.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={child}
                  isReply
                  replyToNickname={comment.nickname}
                />
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
