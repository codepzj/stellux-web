'use client'

import * as React from 'react'
import { ArchiveXIcon } from 'lucide-react'
import { toast } from 'sonner'
import { AdminEmptyState } from '@/features/admin/components/admin-empty-state'
import { AdminTableLoadingRow } from '@/features/admin/components/admin-loading-state'
import { AdminPagination } from '@/features/admin/components/admin-pagination'
import { ConfirmDialog } from '@/features/admin/components/confirm-dialog'
import { useAdminAuth } from '@/features/admin/components/auth-provider'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import {
  deleteDocumentContentAPI,
  deleteRootDocumentAPI,
  getDocumentBinListAPI,
  getDocumentContentBinListAPI,
  restoreDocumentContentAPI,
  restoreRootDocumentAPI,
} from '@/entities/admin/api'

interface BinRow {
  id: string
  title: string
  description: string
  deleted_at?: string
  type: 'root' | 'content'
}

export function DocumentBinPage() {
  const { request } = useAdminAuth()
  const [rows, setRows] = React.useState<BinRow[]>([])
  const [pageNo, setPageNo] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(20)
  const [loading, setLoading] = React.useState(true)

  const loadRows = React.useCallback(async () => {
    setLoading(true)
    try {
      const [rootRes, contentRes] = await Promise.all([
        getDocumentBinListAPI(request, { page_no: 1, page_size: 100 }),
        getDocumentContentBinListAPI(request, { page_no: 1, page_size: 100 }),
      ])
      const rootRows = rootRes.data.list.map((doc) => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        deleted_at: doc.deleted_at,
        type: 'root' as const,
      }))
      const contentRows = contentRes.data.list.map((doc) => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        deleted_at: doc.deleted_at,
        type: 'content' as const,
      }))
      setRows(
        [...rootRows, ...contentRows].sort((a, b) =>
          (b.deleted_at ?? '').localeCompare(a.deleted_at ?? '')
        )
      )
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '加载回收箱失败')
    } finally {
      setLoading(false)
    }
  }, [request])

  React.useEffect(() => {
    loadRows()
  }, [loadRows])

  const pagedRows = React.useMemo(() => {
    const start = (pageNo - 1) * pageSize
    return rows.slice(start, start + pageSize)
  }, [pageNo, pageSize, rows])

  React.useEffect(() => {
    const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
    if (pageNo > pageCount) setPageNo(pageCount)
  }, [pageNo, pageSize, rows.length])

  const restore = async (row: BinRow) => {
    if (row.type === 'root') {
      await restoreRootDocumentAPI(request, row.id)
    } else {
      await restoreDocumentContentAPI(request, row.id)
    }
    toast.success('恢复成功')
    await loadRows()
  }

  const remove = async (row: BinRow) => {
    if (row.type === 'root') {
      await deleteRootDocumentAPI(request, row.id)
    } else {
      await deleteDocumentContentAPI(request, row.id)
    }
    toast.success('删除成功')
    await loadRows()
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-base font-semibold">文档回收箱</h1>
      </div>
      <div className="flex min-h-[calc(100svh-10rem)] flex-1 flex-col gap-4">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>删除时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <AdminTableLoadingRow colSpan={4} className="min-h-[420px]" />
              ) : pagedRows.length ? (
                pagedRows.map((row) => (
                  <TableRow key={`${row.type}-${row.id}`}>
                    <TableCell>
                      <div className="font-medium">{row.title}</div>
                      <div className="max-w-xl truncate text-sm text-muted-foreground">
                        {row.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.type === 'root' ? '根文档' : '内容'}</Badge>
                    </TableCell>
                    <TableCell>
                      {row.deleted_at ? new Date(row.deleted_at).toLocaleString('zh-CN') : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="xs" onClick={() => restore(row)}>
                          恢复
                        </Button>
                        <ConfirmDialog
                          title="永久删除"
                          description="该操作不可恢复。"
                          onConfirm={() => remove(row)}
                        >
                          <Button variant="ghost" size="xs">
                            删除
                          </Button>
                        </ConfirmDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
                    <AdminEmptyState
                      icon={ArchiveXIcon}
                      title="回收箱为空"
                      description="被删除的文档和目录会出现在这里。"
                      className="min-h-[420px]"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <AdminPagination
          page={pageNo}
          pageSize={pageSize}
          total={rows.length}
          onPageChange={setPageNo}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize)
            setPageNo(1)
          }}
        />
      </div>
    </div>
  )
}
