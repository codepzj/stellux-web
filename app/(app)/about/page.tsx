import AboutContent from './content'
import { getActivePageConfigAPI } from '@/api/page'
import { PageContent } from '@/types/page'

export default async function About() {
  const { data: pageConfig } = await getActivePageConfigAPI('about').catch(() => ({ data: null }))
  const config: PageContent | undefined = pageConfig?.content

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <AboutContent config={config} />
    </div>
  )
}
