'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { FriendShowVO } from '@/api/friend'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Globe } from 'lucide-react'

type Props = {
  friend: FriendShowVO
}

const TYPE_LABELS: Record<number, string> = {
  0: '大佬',
  1: '技术型',
  2: '设计型',
  3: '生活型',
}

export default function FriendCard({ friend }: Props) {
  const typeLabel = TYPE_LABELS[friend.website_type] ?? '其他'

  return (
    <Link href={friend.site_url} target="_blank" rel="noreferrer noopener" className="block">
      <Card className="transition-colors duration-200 border border-gray-200 dark:border-border shadow-sm dark:shadow-none bg-white/90 dark:bg-card/80 hover:bg-gray-50 dark:hover:bg-card/90 cursor-pointer group rounded-lg">
        <CardHeader className="flex flex-row items-start gap-3 pb-2">
          <div className="shrink-0">
            <Image
              alt={friend.name}
              src={friend.avatar_url || '/favicon.ico'}
              width={48}
              height={48}
              className="object-cover ring-2 ring-gray-200/80 dark:ring-gray-800/80 w-12 h-12 rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-400 line-clamp-2">
              {friend.name}
            </CardTitle>
            <CardDescription className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
              {friend.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter className="flex items-center gap-2 pt-2">
          <Badge variant="secondary" labelRole="category">
            <Globe className="h-3 w-3 mr-1" />
            {typeLabel}
          </Badge>
          <Badge variant="outline" labelRole="meta">
            <ExternalLink className="h-3 w-3 mr-1" />
            访问
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}
