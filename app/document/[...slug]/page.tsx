import { getDocumentByAlias } from '@/api/document'
import { getAllDocumentContentByDocumentId } from '@/api/document-content'
import { Markdown } from '@/components/Md'
import { FloatingToc } from '@/components/Toc'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { DocSidebar } from '@/components/Sidebar'
import { convertToDocumentTreeData } from '@/utils/document-tree'
import { DocumentContentVO } from '@/types/document-content'
import { Metadata } from 'next'
import { SidebarToggle } from '@/components/SideTool/sidebar-toggle'
import { BackToTop } from '@/components/SideTool/back-to-top'
import Link from 'next/link'
import type { DocTreeItem } from '@/utils/document-tree'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DocPageProps {
  params: Promise<{ slug: string[] }> // 路径参数
}

type NavPage = { title: string; url: string; isDir: boolean }

function flattenDocTree(items: DocTreeItem[]): Array<NavPage> {
  const result: NavPage[] = []
  const walk = (nodes: DocTreeItem[]) => {
    for (const node of nodes) {
      result.push({ title: node.title, url: node.url, isDir: node.isDir })
      if (node.items?.length) walk(node.items)
    }
  }
  walk(items)
  return result
}

function RootDocTreeList({
  nodes,
  activeUrl,
  depth = 0,
}: {
  nodes: DocTreeItem[]
  activeUrl: string
  depth?: number
}) {
  if (!nodes.length) return null

  return (
    <ul className={depth === 0 ? 'border-l border-border/60 pl-4 space-y-2' : 'pl-4 space-y-1'}>
      {nodes.map((node) => {
        if (node.isDir) {
          return (
            <li key={node.id} className="space-y-1">
              <details open className="group">
                <summary className="list-none cursor-pointer select-none flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <ChevronRight className="size-3 shrink-0 text-muted-foreground transition-transform group-open:text-foreground group-open:rotate-90" />
                  <span>{node.title}</span>
                </summary>
                {node.items?.length ? (
                  <div className="mt-2">
                    <RootDocTreeList nodes={node.items} activeUrl={activeUrl} depth={depth + 1} />
                  </div>
                ) : null}
              </details>
            </li>
          )
        }

        const isActive = node.url === activeUrl

        return (
          <li key={node.id}>
            <Link
              href={node.url}
              className={[
                'block text-sm px-2 py-1 rounded-md transition-colors',
                'hover:bg-primary/10',
                isActive ? 'bg-primary/10 font-semibold text-primary' : 'text-foreground/90',
              ].join(' ')}
            >
              {node.title}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params
  /* 从路径获取根文档和子文档的别名 
     例如：/doc/root-alias/sub-alias
     rootAlias: root-alias
     subAlias: sub-alias
     如果subAlias为空，则表示访问根文档概览页, 并显示对应的概览页
  */
  const [rootAlias, subAlias] = slug || []

  const isRoot = subAlias === undefined // 是否是根文档概览页

  // 获取根文档
  const document = await getDocumentByAlias(rootAlias).then((res) => {
    return res.data
  })

  // 获取文档列表内容
  const documentContentList = await getAllDocumentContentByDocumentId(document.id).then(
    (res) => res.data
  )

  // 如果当前是子文档, 则获取子文档内容
  let documentContent: DocumentContentVO | undefined
  if (!isRoot) {
    documentContent = documentContentList.find(
      (item) => item.alias === subAlias
    ) as DocumentContentVO
  }

  const treeItems = convertToDocumentTreeData(documentContentList, rootAlias)
  const currentUrl = isRoot ? `/document/${rootAlias}` : `/document/${rootAlias}/${subAlias}`

  const flattenedTree = flattenDocTree(treeItems)
  const orderedPages = flattenedTree.filter(
    (page, idx, arr) => arr.findIndex((p) => p.url === page.url) === idx
  )

  const currentIndex = isRoot ? -1 : orderedPages.findIndex((p) => p.url === currentUrl)
  let prevPage: NavPage | undefined
  let nextPage: NavPage | undefined

  if (currentIndex >= 0) {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!orderedPages[i].isDir) {
        prevPage = orderedPages[i]
        break
      }
    }
    for (let i = currentIndex + 1; i < orderedPages.length; i++) {
      if (!orderedPages[i].isDir) {
        nextPage = orderedPages[i]
        break
      }
    }
  }

  const markdownContent = documentContent?.content || ''

  return (
    <SidebarProvider style={{ '--sidebar-width': '256px' } as React.CSSProperties}>
      <DocSidebar
        docTitle={document?.title}
        doctree={treeItems}
        className="hidden md:block fixed top-0 left-0"
      />
      <SidebarInset>
        <div className="mx-auto mb-20 mt-8 w-full max-w-3xl px-4">
          <h1 className="mb-8 py-4 font-serif text-3xl font-bold tracking-tight text-balance text-foreground">
            {isRoot ? document?.title || '' : documentContent?.title || ''}
          </h1>
          <div className="flex-1">
            {isRoot ? (
              <div className="mt-4">
                <div className="text-lg font-bold">👋  欢迎来到知识库</div>
                <div className="mt-2">
                  知识库就像书一样，让多篇文档结构化，方便知识的创作与沉淀
                </div>
                <div className="mt-8"></div>
                <RootDocTreeList nodes={treeItems} activeUrl={currentUrl} />
              </div>
            ) : (
              <Markdown className="wrap-break-word" content={markdownContent} />
            )}
          </div>

          {!isRoot && (prevPage || nextPage) && (
            <div className="mt-28">
              <div
                className={[
                  'grid grid-cols-1 gap-4 sm:grid-cols-2',
                  prevPage && !nextPage ? 'sm:*:first:col-start-1' : '',
                  !prevPage && nextPage ? 'sm:*:first:col-start-2' : '',
                ].join(' ')}
              >
                {prevPage ? (
                  <Link
                    href={prevPage.url}
                    className="group rounded-lg border border-border/60 bg-background/40 px-4 py-3 transition-colors hover:bg-primary/10 hover:text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronLeft className="size-4 text-muted-foreground group-hover:text-foreground" />
                      <span className="text-xs text-muted-foreground group-hover:text-foreground">
                        上一页
                      </span>
                    </div>
                    <div className="mt-2 line-clamp-2 text-sm font-medium">{prevPage.title}</div>
                  </Link>
                ) : null}

                {nextPage ? (
                  <Link
                    href={nextPage.url}
                    className="group rounded-lg border border-border/60 bg-background/40 px-4 py-3 transition-colors hover:bg-primary/10 hover:text-foreground"
                  >
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-muted-foreground group-hover:text-foreground">
                        下一页
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground" />
                    </div>
                    <div className="mt-2 line-clamp-2 text-right text-sm font-medium">
                      {nextPage.title}
                    </div>
                  </Link>
                ) : null}
              </div>
            </div>
          )}
        </div>
        {!isRoot && (
          <FloatingToc content={markdownContent} className="bottom-28" />
        )}
        <SidebarToggle />
        <BackToTop />
      </SidebarInset>
    </SidebarProvider>
  )
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params
  const [rootAlias, subAlias] = slug || []

  const isRoot = subAlias === undefined

  // 获取根文档
  const document = await getDocumentByAlias(rootAlias).then((res) => {
    return res.data
  })

  // 获取文档列表内容
  const documentContentList = await getAllDocumentContentByDocumentId(document.id).then(
    (res) => res.data
  )

  // 如果当前是子文档, 则获取子文档内容
  let documentContent: DocumentContentVO | undefined
  if (!isRoot) {
    documentContent = documentContentList.find(
      (item) => item.alias === subAlias
    ) as DocumentContentVO
  }

  const title = isRoot ? document?.title || '' : documentContent?.title || ''
  const description = isRoot
    ? document?.description || ''
    : documentContent?.content?.substring(0, 200) || ''
  const image = document?.thumbnail
  const url = `/document/${rootAlias}${
    subAlias ? `/${subAlias}` : ''
  }`

  return {
    title,
    description,
    keywords: ['Go语言', '文档', '教程', title],
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  }
}
