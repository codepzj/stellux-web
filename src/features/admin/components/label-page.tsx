'use client'

import * as React from 'react'
import { TagsIcon } from 'lucide-react'
import { toast } from 'sonner'
import { AdminEmptyState } from '@/features/admin/components/admin-empty-state'
import { AdminTableLoadingRow } from '@/features/admin/components/admin-loading-state'
import { AdminPagination } from '@/features/admin/components/admin-pagination'
import { ConfirmDialog } from '@/features/admin/components/confirm-dialog'
import { useAdminAuth } from '@/features/admin/components/auth-provider'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group'
import {
  createLabelAPI,
  deleteLabelAPI,
  editLabelAPI,
  queryLabelListAPI,
} from '@/entities/admin/api'
import type { LabelType, LabelVO } from '@/entities/admin/types/label'

export function LabelPage() {
  const { request } = useAdminAuth()
  const [activeKey, setActiveKey] = React.useState<LabelType>('category')
  const [labels, setLabels] = React.useState<LabelVO[]>([])
  const [editing, setEditing] = React.useState<Record<string, LabelVO>>({})
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [pageNo, setPageNo] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(20)
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadLabels = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await queryLabelListAPI(request, {
        page_no: pageNo,
        page_size: pageSize,
        label_type: activeKey,
      })
      setLabels(response.data.list)
      setTotal(response.data.total_count)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '加载标签失败')
    } finally {
      setLoading(false)
    }
  }, [activeKey, pageNo, pageSize, request])

  React.useEffect(() => {
    loadLabels()
  }, [loadLabels])

  const createLabel = async () => {
    if (!name) return
    try {
      await createLabelAPI(request, { label_type: activeKey, name })
      toast.success('创建成功')
      setName('')
      setOpen(false)
      await loadLabels()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '创建失败')
    }
  }

  const saveLabel = async (record: LabelVO) => {
    const next = editing[record.id]
    if (!next) return
    if (activeKey === 'category' && next.name.length > 4) {
      toast.warning('分类名称不能超过 4 个字符')
      return
    }
    if (activeKey === 'tag' && next.name.length > 10) {
      toast.warning('标签名称不能超过 10 个字符')
      return
    }
    try {
      await editLabelAPI(request, next)
      toast.success('修改成功')
      setEditing((current) => {
        const clone = { ...current }
        delete clone[record.id]
        return clone
      })
      await loadLabels()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold">文章标签</h1>
          <p className="mt-1 text-sm text-muted-foreground">管理分类和标签。</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>新增</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增{activeKey === 'category' ? '分类' : '标签'}</DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel>类型</FieldLabel>
                <Input value={activeKey} disabled />
              </Field>
              <Field>
                <FieldLabel htmlFor="label-name">名称</FieldLabel>
                <Input
                  id="label-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button onClick={createLabel}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex min-h-[calc(100svh-12rem)] flex-1 flex-col gap-4">
        <ToggleGroup
          type="single"
          value={activeKey}
          onValueChange={(value) => {
            if (value) {
              setActiveKey(value as LabelType)
              setPageNo(1)
            }
          }}
        >
          <ToggleGroupItem value="category">分类</ToggleGroupItem>
          <ToggleGroupItem value="tag">标签</ToggleGroupItem>
        </ToggleGroup>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <AdminTableLoadingRow colSpan={3} className="min-h-[360px]" />
              ) : labels.length ? (
                labels.map((label) => {
                  const draft = editing[label.id]
                  return (
                    <TableRow key={label.id}>
                      <TableCell>
                        {draft ? (
                          <Input
                            value={draft.name}
                            onChange={(event) =>
                              setEditing((current) => ({
                                ...current,
                                [label.id]: { ...draft, name: event.target.value },
                              }))
                            }
                          />
                        ) : (
                          <Badge variant="secondary">{label.name}</Badge>
                        )}
                      </TableCell>
                      <TableCell>{label.label_type}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          {draft ? (
                            <>
                              <Button variant="ghost" size="xs" onClick={() => saveLabel(label)}>
                                保存
                              </Button>
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() =>
                                  setEditing((current) => {
                                    const clone = { ...current }
                                    delete clone[label.id]
                                    return clone
                                  })
                                }
                              >
                                取消
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() =>
                                  setEditing((current) => ({
                                    ...current,
                                    [label.id]: { ...label },
                                  }))
                                }
                              >
                                编辑
                              </Button>
                              <ConfirmDialog
                                title="删除标签"
                                description="删除后不可恢复。"
                                onConfirm={async () => {
                                  await deleteLabelAPI(request, label.id)
                                  toast.success('删除成功')
                                  await loadLabels()
                                }}
                              >
                                <Button variant="ghost" size="xs">
                                  删除
                                </Button>
                              </ConfirmDialog>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="p-0">
                    <AdminEmptyState
                      icon={TagsIcon}
                      title={activeKey === 'category' ? '暂无分类' : '暂无标签'}
                      description="创建后会显示在这里。"
                      className="min-h-[360px]"
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
          total={total}
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
