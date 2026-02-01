import Md from './ui/md'

export const Markdown = ({ content, className }: { content: string; className?: string }) => {
  return <Md content={content} className={className} />
}

export { MdPageSkeleton } from './MdPageSkeleton'
