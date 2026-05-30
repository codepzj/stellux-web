'use client'

import { useEffect, useState } from 'react'
import { createFriendAPI } from '@/api/friend'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function FriendSubmitModal() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [websiteType, setWebsiteType] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { code, error } = await createFriendAPI({
        name,
        description,
        site_url: siteUrl,
        avatar_url: avatarUrl,
        website_type: websiteType,
      })
      if (code === 200) {
        toast.success('提交成功, 待审核后显示')
        setName('')
        setDescription('')
        setSiteUrl('')
        setAvatarUrl('')
        setWebsiteType(0)
        setIsOpen(false)
      } else {
        toast.error(error || '提交失败, 请稍后重试')
      }
    } catch (err) {
      toast.error('提交异常, 请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="link" className="p-0 h-auto min-h-0" onClick={() => setIsOpen(true)}>
        <span className="text-blue-600 hover:underline">自助提交友链 →</span>
      </Button>

      {mounted && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>友链自助提交</DialogTitle>
              <DialogDescription>请填写完整信息，审核后会展示在友链列表。</DialogDescription>
            </DialogHeader>
            <form
              className="w-full flex flex-col gap-3"
              onSubmit={handleSubmit}
              id="friend-submit-form"
            >
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">网站名称</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="请输入网站名称"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">网站描述</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="请输入网站描述"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">网站地址</label>
                <Input
                  type="url"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  required
                  placeholder="https://www.golangblog.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">头像地址</label>
                <Input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  required
                  placeholder="https://cdn.jsdelivr.net/gh/codepzj/images@main/20250529174726187.jpeg"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">站点类型</label>
                <select
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  value={websiteType}
                  onChange={(e) => setWebsiteType(Number(e.target.value))}
                  disabled={!mounted}
                >
                  <option value={0}>大佬</option>
                  <option value={1}>技术型</option>
                  <option value={2}>设计型</option>
                  <option value={3}>生活型</option>
                </select>
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
                取消
              </Button>
              <Button type="submit" form="friend-submit-form" disabled={loading}>
                {loading ? '提交中...' : '提交'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
