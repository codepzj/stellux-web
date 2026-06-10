'use client'

import * as React from 'react'
import type { CSSProperties } from 'react'
import {
  BoldIcon,
  Code2Icon,
  Heading1Icon,
  Heading2Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Table2Icon,
} from 'lucide-react'

import Md from '@/components/Md/ui/md'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

interface AdminMarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number | string
}

type EditorMode = 'edit' | 'split' | 'preview'
type MarkdownCommand =
  | 'h1'
  | 'h2'
  | 'bold'
  | 'italic'
  | 'quote'
  | 'code'
  | 'unordered-list'
  | 'ordered-list'
  | 'link'
  | 'image'
  | 'table'

const markdownActions: Array<{
  command: MarkdownCommand
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}> = [
  { command: 'h1', label: '一级标题', icon: Heading1Icon },
  { command: 'h2', label: '二级标题', icon: Heading2Icon },
  { command: 'bold', label: '加粗', icon: BoldIcon },
  { command: 'italic', label: '斜体', icon: ItalicIcon },
  { command: 'quote', label: '引用', icon: QuoteIcon },
  { command: 'code', label: '代码块', icon: Code2Icon },
  { command: 'unordered-list', label: '无序列表', icon: ListIcon },
  { command: 'ordered-list', label: '有序列表', icon: ListOrderedIcon },
  { command: 'link', label: '链接', icon: LinkIcon },
  { command: 'image', label: '图片', icon: ImageIcon },
  { command: 'table', label: '表格', icon: Table2Icon },
]

export function AdminMarkdownEditor({ value, onChange, height = 'calc(100svh - 14rem)' }: AdminMarkdownEditorProps) {
  const [mode, setMode] = React.useState<EditorMode>('split')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const previewRootRef = React.useRef<HTMLDivElement>(null)
  const isSyncingScroll = React.useRef(false)
  const editorStyle: CSSProperties = {
    height,
  }

  const getPreviewViewport = React.useCallback(() => {
    return previewRootRef.current?.querySelector<HTMLDivElement>('[data-slot="scroll-area-viewport"]') ?? null
  }, [])

  const syncScroll = React.useCallback((source: HTMLElement, target: HTMLElement) => {
    const sourceMax = source.scrollHeight - source.clientHeight
    const targetMax = target.scrollHeight - target.clientHeight
    const ratio = sourceMax > 0 ? source.scrollTop / sourceMax : 0

    isSyncingScroll.current = true
    target.scrollTop = targetMax > 0 ? ratio * targetMax : 0
    window.requestAnimationFrame(() => {
      isSyncingScroll.current = false
    })
  }, [])

  const syncPreviewFromEditor = React.useCallback((editor: HTMLTextAreaElement) => {
    if (isSyncingScroll.current) return
    const preview = getPreviewViewport()
    if (preview) syncScroll(editor, preview)
  }, [getPreviewViewport, syncScroll])

  React.useEffect(() => {
    const preview = getPreviewViewport()
    if (!preview) return

    const syncEditorFromPreview = () => {
      if (isSyncingScroll.current || !textareaRef.current) return
      syncScroll(preview, textareaRef.current)
    }

    preview.addEventListener('scroll', syncEditorFromPreview, { passive: true })
    return () => preview.removeEventListener('scroll', syncEditorFromPreview)
  }, [getPreviewViewport, syncScroll])

  React.useEffect(() => {
    const editor = textareaRef.current
    const preview = getPreviewViewport()
    if (editor && preview) syncScroll(editor, preview)
  }, [getPreviewViewport, mode, syncScroll, value])

  const showEditor = mode !== 'preview'
  const showPreview = mode !== 'edit'

  const updateSelection = React.useCallback((start: number, end = start) => {
    window.requestAnimationFrame(() => {
      const textarea = textareaRef.current
      if (!textarea) return
      textarea.focus()
      textarea.setSelectionRange(start, end)
      syncPreviewFromEditor(textarea)
    })
  }, [syncPreviewFromEditor])

  const replaceRange = React.useCallback((start: number, end: number, nextText: string, selectStart: number, selectEnd = selectStart) => {
    onChange(`${value.slice(0, start)}${nextText}${value.slice(end)}`)
    updateSelection(selectStart, selectEnd)
  }, [onChange, updateSelection, value])

  const wrapSelection = React.useCallback((before: string, after: string, placeholder: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const { selectionStart, selectionEnd } = textarea
    const selected = value.slice(selectionStart, selectionEnd) || placeholder
    const nextText = `${before}${selected}${after}`
    replaceRange(
      selectionStart,
      selectionEnd,
      nextText,
      selectionStart + before.length,
      selectionStart + before.length + selected.length
    )
  }, [replaceRange, value])

  const prefixSelectedLines = React.useCallback((prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const { selectionStart, selectionEnd } = textarea
    const lineStart = value.lastIndexOf('\n', Math.max(selectionStart - 1, 0)) + 1
    const nextLineBreak = value.indexOf('\n', selectionEnd)
    const lineEnd = nextLineBreak === -1 ? value.length : nextLineBreak
    const selectedBlock = value.slice(lineStart, lineEnd) || '文本'
    const nextBlock = selectedBlock
      .split('\n')
      .map((line, index) => (prefix === '1. ' ? `${index + 1}. ${line}` : `${prefix}${line}`))
      .join('\n')

    replaceRange(lineStart, lineEnd, nextBlock, lineStart, lineStart + nextBlock.length)
  }, [replaceRange, value])

  const runCommand = React.useCallback((command: MarkdownCommand) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const { selectionStart, selectionEnd } = textarea
    const selected = value.slice(selectionStart, selectionEnd)

    if (command === 'h1') {
      prefixSelectedLines('# ')
      return
    }
    if (command === 'h2') {
      prefixSelectedLines('## ')
      return
    }
    if (command === 'bold') {
      wrapSelection('**', '**', '加粗文本')
      return
    }
    if (command === 'italic') {
      wrapSelection('*', '*', '斜体文本')
      return
    }
    if (command === 'quote') {
      prefixSelectedLines('> ')
      return
    }
    if (command === 'code') {
      const code = selected || 'code'
      const nextText = `\`\`\`\n${code}\n\`\`\``
      replaceRange(selectionStart, selectionEnd, nextText, selectionStart + 4, selectionStart + 4 + code.length)
      return
    }
    if (command === 'unordered-list') {
      prefixSelectedLines('- ')
      return
    }
    if (command === 'ordered-list') {
      prefixSelectedLines('1. ')
      return
    }
    if (command === 'link') {
      const text = selected || '链接文本'
      const nextText = `[${text}](https://)`
      replaceRange(selectionStart, selectionEnd, nextText, selectionStart + text.length + 3, selectionStart + text.length + 11)
      return
    }
    if (command === 'image') {
      const alt = selected || '图片描述'
      const nextText = `![${alt}](https://)`
      replaceRange(selectionStart, selectionEnd, nextText, selectionStart + alt.length + 4, selectionStart + alt.length + 12)
      return
    }
    if (command === 'table') {
      const nextText = '| 列 1 | 列 2 |\n| --- | --- |\n| 内容 | 内容 |'
      replaceRange(selectionStart, selectionEnd, nextText, selectionStart, selectionStart + nextText.length)
    }
  }, [prefixSelectedLines, replaceRange, value, wrapSelection])

  return (
    <div
      className="flex min-h-[560px] flex-col overflow-hidden rounded-md border bg-background"
      style={editorStyle}
    >
      <div className="flex shrink-0 flex-col gap-2 border-b bg-muted/30 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup
          type="single"
          value={mode}
          variant="outline"
          size="sm"
          className="grid w-full grid-cols-3 sm:flex sm:w-auto"
          onValueChange={value => {
            if (value) setMode(value as EditorMode)
          }}
        >
          <ToggleGroupItem value="edit">仅编辑</ToggleGroupItem>
          <ToggleGroupItem value="split">编辑预览</ToggleGroupItem>
          <ToggleGroupItem value="preview">仅预览</ToggleGroupItem>
        </ToggleGroup>
        <span className="shrink-0 text-right text-xs tabular-nums text-muted-foreground">{value.length} 字符</span>
      </div>
      <div
        className={cn(
          'grid min-h-0 flex-1 overflow-hidden',
          mode === 'split' && 'grid-rows-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:grid-rows-1',
          mode !== 'split' && 'grid-cols-1'
        )}
      >
        {showEditor && (
          <section
            className={cn(
              'flex min-h-0 min-w-0 flex-col',
              mode === 'split' && 'border-b md:border-r md:border-b-0'
            )}
          >
            <div className="flex min-h-10 shrink-0 flex-col gap-2 border-b px-4 py-2 lg:flex-row lg:items-center lg:justify-between">
              <span className="text-sm font-medium text-foreground">编辑</span>
              <div className="flex max-w-full gap-1 overflow-x-auto">
                {markdownActions.map(action => {
                  const Icon = action.icon
                  return (
                    <Tooltip key={action.command}>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label={action.label}
                          onClick={() => runCommand(action.command)}
                        >
                          <Icon data-icon="inline-start" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{action.label}</TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </div>
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={event => onChange(event.target.value)}
              onScroll={event => syncPreviewFromEditor(event.currentTarget)}
              placeholder="输入 Markdown 内容"
              spellCheck={false}
              className={cn(
                'h-full min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent px-5 py-5 font-mono text-sm leading-7 shadow-none',
                'field-sizing-fixed overflow-auto focus-visible:border-transparent focus-visible:ring-0 md:px-6 md:py-6'
              )}
            />
          </section>
        )}
        {showPreview && (
          <section className="flex min-h-0 min-w-0 flex-col bg-card/30">
            <div className="flex h-10 shrink-0 items-center border-b px-4">
              <span className="text-sm font-medium text-foreground">预览</span>
            </div>
            <ScrollArea ref={previewRootRef} className="min-h-0 flex-1">
              <Md
                content={value || ' '}
                className="min-h-full py-6 pr-8 pl-5 md:py-8 md:pr-12 md:pl-8 [&>h1:first-child]:mt-0 [&>h2:first-child]:mt-0 [&>h3:first-child]:mt-0 [&>p:first-child]:mt-0"
              />
            </ScrollArea>
          </section>
        )}
      </div>
    </div>
  )
}
