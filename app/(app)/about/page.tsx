import AboutContent from './content'
import { getActivePageConfigAPI } from '@/api/page'
import { PageContent } from '@/types/page'

export default async function About() {
  const { data: pageConfig } = await getActivePageConfigAPI('about')
  const config: PageContent = pageConfig.content

  return (
    <div className="w-full px-4 py-8 sm:py-12 md:px-6">
      <AboutContent config={config} />
    </div>
  )
}
