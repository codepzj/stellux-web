import Navbar from '@/shared/components/Navbar'
import { Footer } from '@/shared/components/Footer'
import { HOME_PROFILE } from '@/shared/lib/site-profile'
import type { PageContent } from '@/entities/page/types'
import Link from 'next/link'
import { ArrowRight, LibraryBig } from 'lucide-react'
import { Button } from '@/shared/ui/button'

const HERO_TITLE = '技术博客'
const DEFAULT_DESCRIPTION = '记录工程实践、问题排查与长期沉淀的技术笔记。'

function HomeHero({ description }: { description: string }) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center md:py-16">
      <div className="mx-auto flex w-full max-w-2xl -translate-y-8 flex-col items-center md:-translate-y-12">
        <h1 className="text-balance font-serif text-5xl font-bold tracking-tight text-foreground md:text-6xl">
          {HERO_TITLE}
        </h1>
        <p className="mt-5 max-w-xl text-balance text-lg leading-8 text-muted-foreground md:text-xl md:leading-8">
          {description}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/blog">
              查看最新文章
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/document">
              浏览知识库
              <LibraryBig data-icon="inline-start" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default function Page() {
  const config: Partial<PageContent> = HOME_PROFILE
  const description = config.bio ?? DEFAULT_DESCRIPTION

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1">
        <HomeHero description={description} />
      </main>
      <Footer />
    </div>
  )
}
