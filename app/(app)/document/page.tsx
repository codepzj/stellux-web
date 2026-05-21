'use client'

import { useEffect, useState } from 'react'
import { getAllPublicDocument } from '@/api/document'
import type { DocumentVO } from '@/types/document'
import { ErrorPage } from '@/components/Error/ErrorPage'
import { ContentListShell } from '@/components/ContentList/list-shell'
import { ContentListSkeleton } from '@/components/ContentList/list-skeleton'
import { DocumentListHeader } from '@/components/Document/document-list-header'
import { DocumentCard } from '@/components/Document/document-card'

export default function DocumentPage() {
  const [docList, setDocList] = useState<DocumentVO[]>([])
  const [loading, setLoading] = useState(true)
  const skeletonCount = docList.length > 0 ? docList.length : 4

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const res = await getAllPublicDocument()
        if (!cancelled) setDocList(res.data || [])
      } catch (error) {
        console.error('获取文档列表失败:', error)
        if (!cancelled) setDocList([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!loading && docList.length === 0) {
    return <ErrorPage title="暂无公开文档" />
  }

  return (
    <ContentListShell>
      <DocumentListHeader totalCount={loading ? '…' : docList.length} />
      <div className="flex flex-col gap-3">
        {loading ? (
          <ContentListSkeleton count={skeletonCount} />
        ) : (
          docList.map((doc, index) => (
            <DocumentCard key={doc.id} doc={doc} thumbnailPriority={index === 0} />
          ))
        )}
      </div>
    </ContentListShell>
  )
}
