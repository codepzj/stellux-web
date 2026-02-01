import { MdPageSkeleton } from '@/components/Md'

export default function BlogPostLoading() {
  return (
    <div className="relative text-default-600 flex flex-col gap-4 lg:flex-row p-2 lg:p-4">
      <div className="w-full lg:w-4/5 p-4">
        <MdPageSkeleton />
      </div>
    </div>
  )
}
