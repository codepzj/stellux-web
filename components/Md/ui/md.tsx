'use client'

import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import CopyButton from './copy'
import Image from 'next/image'
import './md.css'
import { cn } from '@/lib/utils'
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

  return <div ref={ref} className="my-4 grid grid-cols-1 place-items-center overflow-x-auto" />
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
          'markdown-body overflow-x-auto overflow-y-hidden font-sans text-pretty antialiased',
          className
        )}
      >
        <ReactMarkdown
          rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
          remarkPlugins={[remarkGfm, remarkMath, addHeaderIdPlugin]}
          components={{
            h1: ({ children }) => (
              <h1 className="markdown-heading scroll-m-16 my-12 text-balance text-center text-4xl font-bold tracking-normal text-gray-900 first:mt-0 dark:text-gray-100">
                {children}
              </h1>
            ),
            h2: ({ node, children, ...props }) => (
              <h2
                id={getHeaderId(node)}
                className="markdown-heading scroll-m-16 my-12 text-balance text-center text-3xl font-bold tracking-normal text-gray-900 first:mt-0 dark:text-gray-100"
                {...props}
              >
                {children}
              </h2>
            ),
            h3: ({ node, children, ...props }) => (
              <h3
                id={getHeaderId(node)}
                className="markdown-heading scroll-m-16 my-10 text-balance text-center text-2xl font-bold tracking-normal text-gray-900 dark:text-gray-100"
                {...props}
              >
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="markdown-heading scroll-m-16 my-8 text-balance text-center text-xl font-semibold tracking-normal text-gray-900 dark:text-gray-100">
                {children}
              </h4>
            ),
            h5: ({ children }) => (
              <h5 className="markdown-heading scroll-m-16 my-7 text-balance text-center text-lg font-semibold tracking-normal text-gray-900 dark:text-gray-100">
                {children}
              </h5>
            ),
            h6: ({ children }) => (
              <h6 className="markdown-heading scroll-m-16 my-6 text-balance text-center text-base font-semibold tracking-normal text-gray-900 dark:text-gray-100">
                {children}
              </h6>
            ),
            p: ({ children }) => (
              <p className="my-6 text-[1.0625rem] leading-loose text-gray-800 dark:text-gray-100">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="mt-6 mb-6 list-disc space-y-2.5 pl-6 text-[1.0625rem] leading-[1.95] text-gray-800 dark:text-gray-100">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="mt-6 mb-6 list-decimal space-y-2.5 pl-6 text-[1.0625rem] leading-[1.95] text-gray-800 dark:text-gray-100">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-[1.0625rem] leading-[1.95] text-gray-800 dark:text-gray-100 [&>p]:my-2">
                {children}
              </li>
            ),
            img: ({ src, alt }) => (
              <PhotoView src={src as string} key={photoIndex++}>
                <Image
                  width={1000}
                  height={1000}
                  className="my-6 rounded-md"
                  src={src as string}
                  alt={alt as string}
                />
              </PhotoView>
            ),
            a: ({ children, href }) => (
              <a
                href={href as string}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors duration-200"
              >
                {children}
              </a>
            ),
            pre: ({ children }) => (
              <pre className="my-8 overflow-x-auto rounded-lg border border-zinc-200/60 bg-zinc-100/70 p-0.5! font-mono text-sm leading-relaxed dark:border-zinc-600/80 dark:bg-zinc-950 dark:text-zinc-100">
                {children}
              </pre>
            ),
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
                  <div className="not-prose relative rounded-md text-sm">
                    <div
                      className="overflow-x-auto p-4 bg-zinc-100/70 dark:bg-zinc-900/40 rounded-b-md"
                      id={id}
                      suppressHydrationWarning
                    >
                      <CopyButton className="absolute top-1.5 right-1.5" copyId={id} />
                      {children}
                    </div>
                  </div>
                )
              }

              // 单行代码块
              return (
                <code className="rounded-md bg-zinc-100/70 dark:bg-zinc-800/50 mx-0.5! px-1 py-1 text-sm! text-gray-800 dark:text-gray-100 font-mono border border-zinc-200/60 dark:border-zinc-700/60">
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