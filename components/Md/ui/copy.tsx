'use client'

import { Clipboard, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CopyButton = ({ copyId, className }: { copyId: string; className?: string }) => {
  const [copied, setCopited] = useState(false)

  const isClipboardSupported = () => {
    return navigator.clipboard && typeof navigator.clipboard.writeText === 'function'
  }

  const waitForElementAndGetText = async (id: string, maxRetries = 10): Promise<string> => {
    for (let i = 0; i < maxRetries; i++) {
      const element = document.getElementById(id)
      if (element) {
        const text =
          element.innerText ||
          element.textContent ||
          element.innerHTML?.replace(/<[^>]*>/g, '') ||
          ''
        if (text.trim()) {
          return text
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
    throw new Error('等待目标元素加载超时')
  }

  // 原生复制方法
  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.width = '2em'
    textArea.style.height = '2em'
    textArea.style.padding = '0'
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      if (!successful) {
        throw new Error('fallbackCopyToClipboard failed')
      }
      return true
    } catch (err) {
      console.error('Fallback copy failed', err)
      return false
    } finally {
      document.body.removeChild(textArea)
    }
  }

  const onCopy = async () => {
    try {
      setCopited(true)
      // 等待元素加载并获取文本内容
      const text = await waitForElementAndGetText(copyId)

      // 检查是否有HTTPS或localhost环境
      const isSecureContext =
        window.isSecureContext ||
        window.location.protocol === 'https:' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'

      let copySuccess = false

      // 现代Clipboard API复制
      if (isClipboardSupported() && isSecureContext) {
        try {
          await navigator.clipboard.writeText(text)
          copySuccess = true
        } catch (clipboardError) {
          copySuccess = fallbackCopyToClipboard(text)
        }
      } else {
        copySuccess = fallbackCopyToClipboard(text) // 原生复制方法
      }

      if (!copySuccess) {
        throw new Error('所有复制方法都失败了')
      }

      setTimeout(() => {
        setCopited(false)
      }, 1500)
    } catch (error) {
      console.error('复制失败:', error)
      setCopited(false)
    }
  }

  return (
    <Button
      onClick={onCopy}
      aria-label="Copy"
      size="icon"
      variant="ghost"
      className={cn('w-8 h-8 p-0 rounded-md', className)}
    >
      {copied ? (
        <Check className="transition-transform duration-300" size={16} />
      ) : (
        <Clipboard className="transition-transform duration-300" size={16} />
      )}
    </Button>
  )
}

export default CopyButton