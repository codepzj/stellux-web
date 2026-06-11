'use client'

import { GitHubCalendar as GHCalendar } from 'react-github-calendar'
import { useTheme } from 'next-themes'

type Props = {
  username: string
}

export default function GitHubCalendar({ username }: Props) {
  const { resolvedTheme } = useTheme()

  return (
    <GHCalendar
      username={username}
      colorScheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      fontSize={12}
      blockSize={12}
      blockMargin={4}
    />
  )
}
