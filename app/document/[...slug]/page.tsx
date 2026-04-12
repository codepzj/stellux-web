import { getDocumentByAlias } from '@/api/document'
import { getAllDocumentContentByDocumentId } from '@/api/document-content'
import { Markdown } from '@/components/Md'
import { ScrollToc } from '@/components/Toc'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { DocSidebar } from '@/components/Sidebar'
import { convertToDocumentTreeData } from '@/utils/document-tree'
import { DocumentContentVO } from '@/types/document-content'
import { Metadata } from 'next'
import { SidebarToggle } from '@/components/SideTool/sidebar-toggle'
import { BackToTop } from '@/components/SideTool/back-to-top'

interface DocPageProps {
  params: Promise<{ slug: string[] }> // 路径参数
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

  return (
    <SidebarProvider style={{ '--sidebar-width': '256px' } as React.CSSProperties}>
      <DocSidebar
        docTitle={document?.title}
        doctree={treeItems}
        className="hidden md:block fixed top-0 left-0"
      />
      <SidebarInset>
        <div className="w-full flex flex-col md:flex-row justify-center gap-2 mt-8">
          <div className="w-full lg:w-4/5 md:max-w-xl lg:max-w-3xl md:mr-4 mb-20 px-4">
            <div className="text-3xl font-bold font-mono py-4 mb-8">
              {isRoot ? document?.title || '' : documentContent?.title || ''}
            </div>
            <Markdown
              className="pl-2 wrap-break-word overflow-x-auto"
              content={isRoot ? document?.description || '' : documentContent?.content || ''}
            />
          </div>
          <div className="hidden lg:block sticky top-8 h-[calc(100vh-1rem)] w-48 min-w-48 shrink-0 flex-none">
            <ScrollToc
              content={isRoot ? document?.description || '' : documentContent?.content || ''}
            />
          </div>
        </div>
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
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/document/${rootAlias}${
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
    metadataBase: new URL(url),
  }
}