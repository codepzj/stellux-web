'use client'

import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

type Props = {
  content: string
  className?: string
}

export function CommentMarkdown({ content, className }: Props) {
  return (
    <div className={cn('comment-markdown min-w-0 text-sm leading-7 text-foreground/90', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
          a: ({ children, href }) => (
            <a
              href={href as string}
              className="text-primary underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l border-border pl-3 text-muted-foreground">
              {children}
            </blockquote>
          ),
          pre: ({ children }) => (
            <pre className="my-3 overflow-x-auto rounded-md border border-border/70 bg-muted/40 p-3 font-mono text-xs leading-6">
              {children}
            </pre>
          ),
          code: ({ className, children }) => {
            const isBlock = className?.startsWith('language-')
            const hasLineBreak = String(children).includes('\n')
            if (isBlock || hasLineBreak) {
              return <code className={cn(className, 'block bg-transparent p-0')}>{children}</code>
            }

            return (
              <code className="rounded border border-border/60 bg-muted/50 px-1.5 py-0.5 font-mono text-[0.85em]">
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
