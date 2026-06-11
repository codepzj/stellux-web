'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import { FileIcon, FolderIcon, PlusIcon, SaveIcon } from 'lucide-react'
import { toast } from 'sonner'
import { AdminEmptyState } from '@/features/admin/components/admin-empty-state'
import { AdminTreeLoadingState } from '@/features/admin/components/admin-loading-state'
import { AdminMarkdownEditor } from '@/features/admin/components/markdown-editor'
import { useAdminAuth } from '@/features/admin/components/auth-provider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'
import { Button } from '@/shared/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/ui/context-menu'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { Textarea } from '@/shared/ui/textarea'
import {
  createDocumentContentAPI,
  getDocumentContentAPI,
  getDocumentTreeDataAPI,
  softDeleteDocumentContentAPI,
  updateDocumentContentAPI,
} from '@/entities/admin/api'
import {
  buildDocumentTree,
  getDescendantIds,
  getNextSort,
  type AdminTreeNode,
} from '@/entities/admin/tree'
import type {
  DocumentContentEditRequest,
  DocumentContentRequest,
  DocumentContentVO,
  DocumentTreeVO,
} from '@/entities/admin/types/document'

type ContentForm = DocumentContentRequest & { id?: string }

const emptyContent = (
  documentId: string,
  parentId = documentId,
  isDir = false,
  sort = 1
): ContentForm => ({
  document_id: documentId,
  title: '',
  content: '',
  description: '',
  alias: '',
  parent_id: parentId,
  is_dir: isDir,
  sort,
})

export function DocumentContentPage() {
  const { id } = useParams<{ id: string }>()
  const { request } = useAdminAuth()
  const [flatRows, setFlatRows] = React.useState<DocumentTreeVO[]>([])
  const [selected, setSelected] = React.useState<DocumentContentVO | null>(null)
  const [editingContent, setEditingContent] = React.useState('')
  const [formOpen, setFormOpen] = React.useState(false)
  const [form, setForm] = React.useState<ContentForm>(emptyContent(id))
  const [removeTarget, setRemoveTarget] = React.useState<AdminTreeNode | null>(null)
  const [loadingTree, setLoadingTree] = React.useState(true)
  const tree = React.useMemo(() => buildDocumentTree(flatRows), [flatRows])
  const isEdit = Boolean(form.id)

  const loadTree = React.useCallback(async () => {
    setLoadingTree(true)
    try {
      const response = await getDocumentTreeDataAPI(request, id)
      setFlatRows(response.data)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '加载文档树失败')
    } finally {
      setLoadingTree(false)
    }
  }, [id, request])

  React.useEffect(() => {
    loadTree()
  }, [loadTree])

  const selectNode = async (nodeId: string) => {
    const row = flatRows.find((item) => item.id === nodeId)
    if (!row || row.is_dir) return
    try {
      const response = await getDocumentContentAPI(request, nodeId)
      setSelected(response.data)
      setEditingContent(response.data.content)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '加载文档内容失败')
    }
  }

  const openCreate = (parentId: string, isDir: boolean) => {
    setForm(emptyContent(id, parentId, isDir, getNextSort(flatRows, parentId)))
    setFormOpen(true)
  }

  const openEdit = async (nodeId: string) => {
    try {
      const response = await getDocumentContentAPI(request, nodeId)
      setForm({ ...response.data })
      setFormOpen(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '加载文档信息失败')
    }
  }

  const submitForm = async () => {
    if (!form.title) {
      toast.warning('请输入标题')
      return
    }
    if (!form.is_dir && !form.alias) {
      toast.warning('文档别名不能为空')
      return
    }

    try {
      if (isEdit) {
        await updateDocumentContentAPI(request, form as DocumentContentEditRequest)
        toast.success('保存成功')
      } else {
        await createDocumentContentAPI(request, form)
        toast.success('创建成功')
      }
      setFormOpen(false)
      await loadTree()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败')
    }
  }

  const saveContent = async () => {
    if (!selected) return
    try {
      await updateDocumentContentAPI(request, {
        id: selected.id,
        document_id: selected.document_id,
        title: selected.title,
        content: editingContent,
        description: selected.description,
        alias: selected.alias,
        parent_id: selected.parent_id,
        is_dir: selected.is_dir,
        sort: selected.sort,
      })
      toast.success('保存成功')
      setSelected({ ...selected, content: editingContent, updated_at: new Date().toISOString() })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败')
    }
  }

  const removeNode = async (nodeId: string) => {
    try {
      const ids = [nodeId, ...getDescendantIds(flatRows, nodeId)]
      await Promise.all(ids.map((itemId) => softDeleteDocumentContentAPI(request, itemId)))
      if (selected && ids.includes(selected.id)) {
        setSelected(null)
        setEditingContent('')
      }
      toast.success('删除成功')
      await loadTree()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败')
    }
  }

  return (
    <div className="grid h-[calc(100svh-6rem)] min-h-[640px] grid-rows-[minmax(220px,35svh)_minmax(0,1fr)] gap-4 lg:grid-cols-[320px_1fr] lg:grid-rows-1">
      <section className="flex min-h-0 flex-col rounded-md border bg-background">
        <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <h1 className="text-base font-semibold">文档内容</h1>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => openCreate(id, false)}
              aria-label="新增文档"
            >
              <PlusIcon />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => openCreate(id, true)}
              aria-label="新增目录"
            >
              <FolderIcon />
            </Button>
          </div>
        </div>
        <div className="min-h-0 flex-1 p-3">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-1 pr-3">
              {loadingTree ? (
                <AdminTreeLoadingState />
              ) : tree.length ? (
                tree.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    level={0}
                    selectedId={selected?.id}
                    onSelect={selectNode}
                    onCreate={openCreate}
                    onEdit={openEdit}
                    onRemoveRequest={setRemoveTarget}
                  />
                ))
              ) : (
                <AdminEmptyState
                  icon={FolderIcon}
                  title="暂无内容"
                  description="新建文档或目录后会显示在这里。"
                  className="min-h-48 py-8"
                />
              )}
            </div>
          </ScrollArea>
        </div>
      </section>
      <section className="flex min-h-0 min-w-0 flex-col">
        <div className="mb-4 flex shrink-0 flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold">
              {selected?.title || '选择一个文档'}
            </h2>
            {selected && (
              <p className="mt-1 text-sm text-muted-foreground">
                更新于{' '}
                {selected.updated_at ? new Date(selected.updated_at).toLocaleString('zh-CN') : '-'}
              </p>
            )}
          </div>
          <Button disabled={!selected} onClick={saveContent}>
            <SaveIcon data-icon="inline-start" />
            保存
          </Button>
        </div>
        <div className="min-h-0 flex-1">
          {selected ? (
            <AdminMarkdownEditor
              value={editingContent}
              onChange={setEditingContent}
              height="100%"
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-md border text-muted-foreground">
              请选择左侧文档开始编辑
            </div>
          )}
        </div>
      </section>
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? '编辑' : '新增'}
              {form.is_dir ? '目录' : '文档'}
            </DialogTitle>
          </DialogHeader>
          <ContentFormView
            form={form}
            updateForm={(key, value) => setForm((current) => ({ ...current, [key]: value }))}
          />
          <DialogFooter>
            <Button onClick={submitForm}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={Boolean(removeTarget)}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除内容</AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget?.is_dir ? '目录会连同子内容一起移入回收箱。' : '该文档会移入回收箱。'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!removeTarget) return
                  await removeNode(removeTarget.id)
                  setRemoveTarget(null)
                }}
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

function TreeNode({
  node,
  level,
  selectedId,
  onSelect,
  onCreate,
  onEdit,
  onRemoveRequest,
}: {
  node: AdminTreeNode
  level: number
  selectedId?: string
  onSelect: (id: string) => void
  onCreate: (parentId: string, isDir: boolean) => void
  onEdit: (id: string) => void
  onRemoveRequest: (node: AdminTreeNode) => void
}) {
  const Icon = node.is_dir ? FolderIcon : FileIcon
  return (
    <div className="flex flex-col gap-1">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="group flex items-center gap-1" style={{ paddingLeft: level * 14 }}>
            <Button
              variant={selectedId === node.id ? 'secondary' : 'ghost'}
              className="min-w-0 flex-1 justify-start"
              size="sm"
              onClick={() => onSelect(node.id)}
            >
              <Icon data-icon="inline-start" />
              <span className="truncate">{node.title}</span>
            </Button>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-44">
          <ContextMenuGroup>
            {!node.is_dir && (
              <ContextMenuItem onSelect={() => onSelect(node.id)}>打开</ContextMenuItem>
            )}
            <ContextMenuItem onSelect={() => onEdit(node.id)}>编辑</ContextMenuItem>
            {node.is_dir && (
              <>
                <ContextMenuItem onSelect={() => onCreate(node.id, false)}>
                  新增文档
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => onCreate(node.id, true)}>新增目录</ContextMenuItem>
              </>
            )}
            <ContextMenuItem variant="destructive" onSelect={() => onRemoveRequest(node)}>
              删除
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
      {node.children?.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          level={level + 1}
          selectedId={selectedId}
          onSelect={onSelect}
          onCreate={onCreate}
          onEdit={onEdit}
          onRemoveRequest={onRemoveRequest}
        />
      ))}
    </div>
  )
}

function ContentFormView({
  form,
  updateForm,
}: {
  form: ContentForm
  updateForm: <K extends keyof ContentForm>(key: K, value: ContentForm[K]) => void
}) {
  return (
    <FieldGroup>
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>标题</FieldLabel>
          <Input value={form.title} onChange={(event) => updateForm('title', event.target.value)} />
        </Field>
        {!form.is_dir && (
          <Field>
            <FieldLabel>别名</FieldLabel>
            <Input
              value={form.alias}
              onChange={(event) => updateForm('alias', event.target.value)}
            />
          </Field>
        )}
      </div>
      {!form.is_dir && (
        <Field>
          <FieldLabel>描述</FieldLabel>
          <Textarea
            value={form.description}
            onChange={(event) => updateForm('description', event.target.value)}
          />
        </Field>
      )}
      <Field>
        <FieldLabel>排序</FieldLabel>
        <Input
          type="number"
          value={form.sort}
          onChange={(event) => updateForm('sort', Number(event.target.value))}
        />
      </Field>
    </FieldGroup>
  )
}
