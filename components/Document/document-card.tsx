'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, FileText } from 'lucide-react'
import { WikiIcon } from '@/components/SvgIcon'
import { formatRelativeTime } from '@/utils/date'
import type { DocumentVO } from '@/types/document'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { contentListCardClassName, cn } from '@/lib/utils'

export function DocumentCard({
  doc,
  thumbnailPriority = false,
}: {
  doc: DocumentVO
  thumbnailPriority?: boolean
}) {
  return (
    <Card className={cn('border-0 shadow-none max-sm:p-3.5', contentListCardClassName)}>
      <Link
        href={`/document/${doc.alias}`}
        className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`阅读：${doc.title}`}
      />
      <CardContent className="relative z-10 p-0 pointer-events-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-5">
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-2.5 sm:gap-3">
            <div className="min-w-0">
              <h2 className="line-clamp-2 font-serif text-base font-semibold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-lg md:text-xl">
                {doc.title}
              </h2>
              {doc.description ? (
                <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:mt-2 sm:line-clamp-2 md:line-clamp-1">
                  {doc.description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Badge variant="secondary" labelRole="category">
                <FileText className="size-3 shrink-0" aria-hidden />
                文档
              </Badge>
              {doc.created_at ? (
                <Badge variant="outline" labelRole="meta" className="w-fit shrink-0">
                  <Calendar className="size-3 shrink-0" aria-hidden />
                  {formatRelativeTime(doc.created_at)}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="relative hidden w-36 shrink-0 sm:block md:w-40">
            <AspectRatio
              ratio={16 / 9}
              className="overflow-hidden rounded-lg bg-muted/50 ring-1 ring-inset ring-border/60"
            >
              {doc.thumbnail ? (
                <Image
                  src={doc.thumbnail}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.04]"
                  {...(thumbnailPriority
                    ? { priority: true }
                    : { loading: 'lazy' as const })}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-muted/80 to-muted/40">
                  <WikiIcon className="size-8 text-muted-foreground/60" aria-hidden />
                </div>
              )}
            </AspectRatio>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
