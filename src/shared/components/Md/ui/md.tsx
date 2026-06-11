'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import CopyButton from './copy'
import Image from 'next/image'
import './md.css'
import { cn } from '@/shared/lib/utils'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

import mermaid from 'mermaid'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

const Mermaid = ({ code }: { code: string }) => {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (ref.current) {
      const id = 'mermaid-' + Math.random().toString(36).slice(2, 11)
      ref.current.id = id
      mermaid.initialize({ startOnLoad: false })
      ref.current.innerHTML = ''
      mermaid
        .render(id + '-svg', code)
        .then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg
          }
        })
        .catch((e: any) => {
          console.error(e)
          if (ref.current) {
            ref.current.innerHTML = `<pre>${code}</pre>`
          }
        })
    }
  }, [code])

  return <div ref={ref} className="my-8 grid grid-cols-1 place-items-center overflow-x-auto" />
}

function addHeaderIds(ast: any) {
  let headerIndex = 1
  function traverse(node: any) {
    if (!node) return
    if (Array.isArray(node)) {
      node.forEach(traverse)
      return
    }
    if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
      node.data = node.data || {}
      node.data.hProperties = node.data.hProperties || {}
      node.data.id = `header-${headerIndex++}`
      node.data.hProperties.id = node.data.id
    }
    if (node.children) {
      traverse(node.children)
    }
  }
  traverse(ast)
}

export default function Md({ content, className }: { content: string; className?: string }) {
  const addHeaderIdPlugin = () => (tree: any) => {
    addHeaderIds(tree)
  }

  function getHeaderId(node: any): string | undefined {
    return node?.data?.id || node?.data?.hProperties?.id
  }

  let photoIndex = 0

  return (
    <PhotoProvider>
      <article
        className={cn(
          'markdown-body min-w-0 max-w-full overflow-x-hidden pb-12 font-sans text-pretty text-foreground antialiased md:pb-16 lg:pb-20',
          className
        )}
      >
        <ReactMarkdown
          rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
          remarkPlugins={[remarkGfm, remarkMath, addHeaderIdPlugin]}
          components={{
            h1: ({ children }) => (
              <h1 className="markdown-heading scroll-m-20 font-serif text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {children}
              </h1>
            ),
            h2: ({ node, children, ...props }) => (
              <h2
                id={getHeaderId(node)}
                className="markdown-heading scroll-m-20 mt-12 font-serif text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl"
                {...props}
              >
                {children}
              </h2>
            ),
            h3: ({ node, children, ...props }) => (
              <h3
                id={getHeaderId(node)}
                className="markdown-heading scroll-m-20 mt-10 text-balance text-xl font-semibold tracking-tight text-foreground md:text-2xl"
                {...props}
              >
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="my-6 text-[15px] leading-[1.85] text-foreground/90 md:my-7 md:text-base">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="my-6 list-disc space-y-2 pl-6 text-[15px] leading-[1.85] text-foreground/90 md:my-7 md:text-base">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="my-6 list-decimal space-y-2 pl-6 text-[15px] leading-[1.85] text-foreground/90 md:my-7 md:text-base">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-[15px] leading-[1.85] text-foreground/90 md:text-base [&>p:first-child]:inline [&>p:not(:first-child)]:mt-2 [&>p]:my-0">
                {children}
              </li>
            ),
            table: ({ children }) => (
              <div className="md-table-wrap w-full">
                <table className="w-full table-fixed border-collapse">{children}</table>
              </div>
            ),
            img: ({ src, alt }) => (
              <PhotoView src={src as string} key={photoIndex++}>
                <Image
                  width={1000}
                  height={1000}
                  className="my-8 rounded-lg ring-1 ring-border/50"
                  src={src as string}
                  alt={alt as string}
                />
              </PhotoView>
            ),
            a: ({ children, href }) => (
              <a
                href={href as string}
                className="font-medium text-primary underline decoration-primary/30 underline-offset-[3px] transition-colors hover:text-primary/80"
              >
                {children}
              </a>
            ),
            pre: ({ children }) => <div className="md-code-frame">{children}</div>,
            code: ({ className, children }) => {
              const match = /language-(\w+)/.exec(className || '')
              const count =
                React.Children.toArray(children).length === 1
                  ? (React.Children.toArray(children)[0].toString().match(/\n/g) || []).length
                  : 0

              // 支持mermaid
              if (match && match[1] === 'mermaid') {
                // 只取children的文本内容
                const code =
                  typeof children === 'string'
                    ? children
                    : React.Children.toArray(children)
                        .map((c) => (typeof c === 'string' ? c : ''))
                        .join('')
                return <Mermaid code={code} />
              }
              if (match?.length || count > 0) {
                const id = Math.random().toString(36).slice(2, 11)
                return (
                  <div className="not-prose relative min-w-0 max-w-full rounded-md text-sm">
                    <CopyButton className="absolute top-1.5 right-1.5 z-10" copyId={id} />
                    <div className="md-code-scroll" id={id} suppressHydrationWarning>
                      {children}
                    </div>
                  </div>
                )
              }

              // 单行代码块
              return (
                <code className="mx-0.5! rounded-md border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-sm! text-foreground">
                  {children}
                </code>
              )
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </PhotoProvider>
  )
}
