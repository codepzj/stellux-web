'use client'

import { useRef, useState } from 'react'
import { Eye, FileText, Loader2, Send, UserRound, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCommentAvatarUrl, getCommentDeviceId } from '@/lib/comment-client'
import { useIsMobile } from '@/hooks/use-mobile'
import type { CommentVO, CreateCommentDTO } from '@/types/comment'
import { CommentMarkdown } from './comment-markdown'

type Props = {
  postId: string
  replyTarget: CommentVO | null
  onCancelReply: () => void
  onSubmit: (data: CreateCommentDTO) => Promise<boolean>
  compact?: boolean
}

export function CommentForm({
  postId,
  replyTarget,
  onCancelReply,
  onSubmit,
  compact = false,
}: Props) {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [error, setError] = useState('')
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const avatarUrl = getCommentAvatarUrl(email)
  const isMobile = useIsMobile()

  const contentPlaceholder = replyTarget
    ? isMobile
      ? '写下回复，支持 Markdown'
      : '写下你的回复，支持 Markdown。'
    : isMobile
      ? '提问或反馈，支持 Markdown'
      : '评论体验区。提问和反馈都可以写在这里，支持 Markdown。'

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmedNickname = nickname.trim()
    const trimmedEmail = email.trim()
    const trimmedContent = content.trim()

    if (!trimmedNickname || !trimmedEmail || !trimmedContent) {
      setError('请填写昵称、邮箱和评论内容')
      return
    }

    const deviceId = getCommentDeviceId().trim()
    if (!deviceId) {
      setError('浏览器设备标识生成失败，请刷新页面后再试')
      return
    }

    setError('')
    setSubmitting(true)
    const ok = await onSubmit({
      post_id: postId,
      parent_id: replyTarget?.id ?? null,
      device_id: deviceId,
      nickname: trimmedNickname,
      avatar: getCommentAvatarUrl(trimmedEmail),
      email: trimmedEmail,
      website: website.trim(),
      content: trimmedContent,
    })
    setSubmitting(false)

    if (ok) {
      setContent('')
    }
  }

  return (
    <form className={compact ? 'mt-3' : 'bg-background py-1'} onSubmit={handleSubmit}>
      {replyTarget && !compact ? (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-md border border-border/70 bg-muted/30 px-3 py-2 text-sm">
          <span className="min-w-0 truncate text-muted-foreground">
            回复 <span className="font-medium text-foreground">{replyTarget.nickname}</span>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={onCancelReply}
            aria-label="取消回复"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-[2.25rem_1fr]">
        <Avatar className="hidden size-8 border border-border/80 bg-muted shadow-xs shadow-black/[0.03] sm:flex">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={email.trim() || '评论头像'} /> : null}
          <AvatarFallback className="bg-muted text-muted-foreground">
            <UserRound className="size-4" aria-hidden="true" />
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 space-y-2">
          <div className="grid gap-2 md:grid-cols-3">
            <div className="flex h-[30px] overflow-hidden rounded-md border border-border/80 bg-background transition-colors focus-within:border-muted-foreground/40 dark:bg-card/30">
              <span className="flex shrink-0 items-center border-r border-border/70 bg-muted/40 px-2 text-sm text-foreground/80">
                昵称
              </span>
              <Label htmlFor="comment-nickname" className="sr-only">
                昵称
              </Label>
              <Input
                id="comment-nickname"
                name="nickname"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="必填"
                autoComplete="name"
                disabled={submitting}
                required
                className="comment-form-control h-full rounded-none border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
              />
            </div>

            <div className="flex h-[30px] overflow-hidden rounded-md border border-border/80 bg-background transition-colors focus-within:border-muted-foreground/40 dark:bg-card/30">
              <span className="flex shrink-0 items-center border-r border-border/70 bg-muted/40 px-2 text-sm text-foreground/80">
                邮箱
              </span>
              <Label htmlFor="comment-email" className="sr-only">
                邮箱
              </Label>
              <Input
                id="comment-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="必填"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                disabled={submitting}
                required
                className="comment-form-control h-full rounded-none border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
              />
            </div>

            <div className="flex h-[30px] overflow-hidden rounded-md border border-border/80 bg-background transition-colors focus-within:border-muted-foreground/40 dark:bg-card/30">
              <span className="flex shrink-0 items-center border-r border-border/70 bg-muted/40 px-2 text-sm text-foreground/80">
                网站
              </span>
              <Label htmlFor="comment-website" className="sr-only">
                网站
              </Label>
              <Input
                id="comment-website"
                name="website"
                type="url"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="选填"
                autoComplete="url"
                inputMode="url"
                spellCheck={false}
                disabled={submitting}
                className="comment-form-control h-full rounded-none border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-border/80 bg-background transition-colors focus-within:border-muted-foreground/40 dark:bg-card/30">
            <Label htmlFor="comment-content" className="sr-only">
              评论内容
            </Label>
            {previewing ? (
              <div className="h-[5.5rem] overflow-y-auto px-3 py-2 text-sm leading-6">
                {content.trim() ? (
                  <CommentMarkdown content={content} className="text-sm leading-6 [&_p]:my-0" />
                ) : (
                  <p className="text-sm leading-6 text-muted-foreground/80">
                    还没有可预览的评论内容
                  </p>
                )}
              </div>
            ) : (
              <textarea
                ref={contentRef}
                id="comment-content"
                name="comment"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder={contentPlaceholder}
                disabled={submitting}
                required
                className="comment-form-control block h-[5.5rem] w-full resize-none border-0 bg-transparent px-3 py-2 text-sm leading-6 outline-none placeholder:text-muted-foreground/70 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:placeholder:text-sm md:placeholder:leading-6"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="size-3.5" aria-hidden="true" />
              支持 Markdown
            </div>
            <div className="flex items-center gap-2">
              {replyTarget && compact ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 border-border/80 bg-background px-3 text-muted-foreground shadow-none hover:bg-muted/50 hover:text-foreground"
                  onClick={onCancelReply}
                >
                  取消
                </Button>
              ) : null}
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 border-border/80 bg-background px-3 text-muted-foreground shadow-none hover:bg-muted/50 hover:text-foreground"
                onClick={() => setPreviewing((value) => !value)}
              >
                <Eye className="size-3.5" aria-hidden="true" />
                {previewing ? '编辑' : '预览'}
              </Button>
              <Button
                type="submit"
                size="sm"
                variant="secondary"
                disabled={submitting}
                className="h-7 px-4"
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="size-4" aria-hidden="true" />
                )}
                {submitting ? '提交中…' : replyTarget ? '回复' : '发布'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-destructive" aria-live="polite">
          {error}
        </p>
      ) : null}
    </form>
  )
}
