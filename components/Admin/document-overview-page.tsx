'use client'

import * as React from 'react'
import Link from 'next/link'
import { BookOpenIcon, MoreHorizontalIcon } from 'lucide-react'
import { toast } from 'sonner'
import { AdminEmptyState } from '@/components/Admin/admin-empty-state'
import { AdminTableLoadingRow } from '@/components/Admin/admin-loading-state'
import { useAdminAuth } from '@/components/Admin/auth-provider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
  createRootDocumentAPI,
  deleteRootDocumentAPI,
  getRootDocumentListAPI,
  softDeleteRootDocumentAPI,
  updateRootDocumentAPI,
} from '@/lib/admin/api'
import type {
  DocumentRootEditRequest,
  DocumentRootRequest,
  DocumentRootVO,
} from '@/types/admin/document'

const emptyDocument = (sort = 1): DocumentRootRequest => ({
  title: '',
  alias: '',
  description: '',
  thumbnail: '',
  document_type: 'document',
  is_public: true,
  sort,
})

function getDocumentRows(data: DocumentRootVO[] | { list: DocumentRootVO[] }) {
  return Array.isArray(data) ? data : data.list
}

export function DocumentOverviewPage() {
  const { request } = useAdminAuth()
  const [documents, setDocuments] = React.useState<DocumentRootVO[]>([])
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState<DocumentRootRequest | DocumentRootEditRequest>(
    emptyDocument()
  )
  const [removeTarget, setRemoveTarget] = React.useState<{
    doc: DocumentRootVO
    mode: 'soft' | 'hard'
  } | null>(null)
  const [loading, setLoading] = React.useState(true)
  const isEdit = 'id' in form

  const loadDocuments = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await getRootDocumentListAPI(request, { page_no: 1, page_size: 100 })
      setDocuments(getDocumentRows(response.data))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '加载文档失败')
    } finally {
      setLoading(false)
    }
  }, [request])

  React.useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const updateForm = <K extends keyof DocumentRootRequest>(
    key: K,
    value: DocumentRootRequest[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const submit = async () => {
    try {
      if (isEdit) {
        await updateRootDocumentAPI(request, form)
        toast.success('文档编辑成功')
      } else {
        await createRootDocumentAPI(request, form)
        toast.success('文档创建成功')
      }
      setOpen(false)
      setForm(emptyDocument(documents.length + 1))
      await loadDocuments()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败')
    }
  }

  const openEdit = (doc: DocumentRootVO) => {
    setForm({
      id: doc.id,
      title: doc.title,
      alias: doc.alias,
      description: doc.description,
      thumbnail: doc.thumbnail,
      document_type: 'document',
      is_public: doc.is_public,
      sort: doc.sort,
    })
    setOpen(true)
  }

  const removeDocument = async () => {
    if (!removeTarget) return
    try {
      if (removeTarget.mode === 'hard') {
        await deleteRootDocumentAPI(request, removeTarget.doc.id)
      } else {
        await softDeleteRootDocumentAPI(request, removeTarget.doc.id)
      }
      toast.success(removeTarget.mode === 'hard' ? '已永久删除' : '已移入回收箱')
      setRemoveTarget(null)
      await loadDocuments()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold">文档列表</h1>
          <p className="mt-1 text-sm text-muted-foreground">管理文档根目录。</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/document/bin">回收箱</Link>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setForm(emptyDocument(documents.length + 1))}>新增文档</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{isEdit ? '编辑文档' : '新增文档'}</DialogTitle>
              </DialogHeader>
              <DocumentRootForm form={form} updateForm={updateForm} />
              <DialogFooter>
                <Button onClick={submit}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex min-h-[calc(100svh-12rem)] flex-1 flex-col gap-4">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>排序</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <AdminTableLoadingRow colSpan={5} className="min-h-[360px]" />
              ) : documents.length ? (
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="min-w-56">
                      <div className="flex min-w-0 flex-col gap-1">
                        <Link
                          href={`/admin/document/content/${doc.id}`}
                          className="font-medium hover:underline"
                        >
                          {doc.title}
                        </Link>
                        <span className="text-sm text-muted-foreground">{doc.alias}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xl truncate text-muted-foreground">
                      {doc.description || '暂无描述'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={doc.is_public ? 'default' : 'secondary'}>
                        {doc.is_public ? '公开' : '私有'}
                      </Badge>
                    </TableCell>
                    <TableCell>{doc.sort}</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" aria-label="文档操作">
                              <MoreHorizontalIcon data-icon="icon" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuGroup>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/document/content/${doc.id}`}>编辑内容</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEdit(doc)}>
                                编辑资料
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setRemoveTarget({ doc, mode: 'soft' })}
                              >
                                移入回收箱
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setRemoveTarget({ doc, mode: 'hard' })}
                              >
                                永久删除
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="p-0">
                    <AdminEmptyState
                      icon={BookOpenIcon}
                      title="暂无文档"
                      description="新增文档后会显示在这里。"
                      className="min-h-[360px]"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <AlertDialog
        open={Boolean(removeTarget)}
        onOpenChange={(next) => !next && setRemoveTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {removeTarget?.mode === 'hard' ? '永久删除文档' : '移入回收箱'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget?.mode === 'hard'
                ? '永久删除后不可恢复。'
                : '文档会进入回收箱，之后可以恢复。'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant={removeTarget?.mode === 'hard' ? 'destructive' : 'default'}
                onClick={removeDocument}
              >
                确定
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function DocumentRootForm({
  form,
  updateForm,
}: {
  form: DocumentRootRequest | DocumentRootEditRequest
  updateForm: <K extends keyof DocumentRootRequest>(key: K, value: DocumentRootRequest[K]) => void
}) {
  return (
    <FieldGroup>
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>标题</FieldLabel>
          <Input value={form.title} onChange={(event) => updateForm('title', event.target.value)} />
        </Field>
        <Field>
          <FieldLabel>别名</FieldLabel>
          <Input value={form.alias} onChange={(event) => updateForm('alias', event.target.value)} />
        </Field>
      </div>
      <Field>
        <FieldLabel>描述</FieldLabel>
        <Textarea
          value={form.description}
          onChange={(event) => updateForm('description', event.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel>封面</FieldLabel>
        <Input
          value={form.thumbnail}
          onChange={(event) => updateForm('thumbnail', event.target.value)}
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>排序</FieldLabel>
          <Input
            type="number"
            value={form.sort}
            onChange={(event) => updateForm('sort', Number(event.target.value))}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={form.is_public}
            onCheckedChange={(value) => updateForm('is_public', value)}
          />
          是否公开
        </label>
      </div>
    </FieldGroup>
  )
}
