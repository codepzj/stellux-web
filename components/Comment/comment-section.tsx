'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createCommentAPI, getCommentListAPI } from '@/api/comment'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { CommentVO, CreateCommentDTO } from '@/types/comment'
import { CommentForm } from './comment-form'
import { CommentList } from './comment-list'

type Props = {
  postId: string
}

export function CommentSection({ postId }: Props) {
  const [comments, setComments] = useState<CommentVO[]>([])
  const [replyTarget, setReplyTarget] = useState<CommentVO | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState('')

  const loadComments = async () => {
    setLoading(true)
    setError('')
    const { code, data, error } = await getCommentListAPI(postId)
    if (code === 200) {
      setComments(data ?? [])
    } else {
      setError(error || '评论加载失败')
    }
    setHasLoaded(true)
    setLoading(false)
  }

  useEffect(() => {
    let ignore = false

    const fetchComments = async () => {
      setLoading(true)
      setError('')
      const { code, data, error } = await getCommentListAPI(postId)
      if (ignore) {
        return
      }
      if (code === 200) {
        setComments(data ?? [])
      } else {
        setError(error || '评论加载失败')
      }
      setHasLoaded(true)
      setLoading(false)
    }

    fetchComments()

    return () => {
      ignore = true
    }
  }, [postId])

  const handleSubmit = async (data: CreateCommentDTO) => {
    const { code, error } = await createCommentAPI(data)
    if (code !== 200) {
      toast.error(error || '评论提交失败')
      return false
    }

    toast.success(data.parent_id ? '回复成功' : '评论成功')
    setReplyTarget(null)
    await loadComments()
    return true
  }

  return (
    <section id="comment" className="mt-14 scroll-mt-24 border-t border-border/70 pt-8">
      <div className="mb-5">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">评论区</h2>
      </div>

      <div className="space-y-7">
        <CommentForm
          postId={postId}
          replyTarget={null}
          onCancelReply={() => setReplyTarget(null)}
          onSubmit={handleSubmit}
        />

        {loading && hasLoaded ? (
          <CommentListSkeleton />
        ) : !hasLoaded ? null : error ? (
          <Alert variant="destructive">
            <AlertTitle>评论加载失败</AlertTitle>
            <AlertDescription>
              <p>{error}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={loadComments}
              >
                重试
              </Button>
            </AlertDescription>
          </Alert>
        ) : comments.length === 0 ? (
          <div className="border-y border-dashed border-border/80 py-8 text-center text-sm text-muted-foreground">
            暂无评论，来抢沙发
          </div>
        ) : (
          <CommentList
            postId={postId}
            comments={comments}
            replyTarget={replyTarget}
            onReply={setReplyTarget}
            onCancelReply={() => setReplyTarget(null)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </section>
  )
}

function CommentListSkeleton() {
  return (
    <div className="space-y-5" aria-label="评论加载中">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="grid grid-cols-[2.5rem_1fr] gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3.5 w-16 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
              <Skeleton className="size-7 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-4/5 rounded" />
              <Skeleton className="h-3.5 w-1/2 rounded" />
            </div>
            <Skeleton className="h-2.5 w-32 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
