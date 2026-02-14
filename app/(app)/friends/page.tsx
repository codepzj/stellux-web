import { FriendShowVO, getFriendListAPI } from '@/api/friend'
import FriendCard from '@/components/Friends/FriendCard'
import FriendSubmitModal from '@/components/Friends/FriendSubmitModal'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Globe, Crown, Info } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function FriendsPage() {
  const { data } = await getFriendListAPI()
  const friendList: FriendShowVO[] = data || []

  const typeLabels: Record<number, string> = {
    0: '大佬',
    1: '技术型',
    2: '设计型',
    3: '生活型',
  }

  const groups: Record<number, typeof friendList> = { 0: [], 1: [], 2: [], 3: [] }
  friendList?.forEach((f) => {
    const t = f.website_type as number
    if (t in groups) groups[t]!.push(f)
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {[0, 1, 2, 3].map((t) =>
        groups[t] && groups[t]!.length > 0 ? (
          <section key={t} className={`mb-8 ${t === 0 ? 'mt-12' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">{typeLabels[t]}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups[t]!.map((f) => (
                <FriendCard key={`${f.site_url}-${f.name}`} friend={f} />
              ))}
            </div>
          </section>
        ) : null
      )}
      <div className="my-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-0.5" />
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">友链交换规则</div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              每月持续输出内容；请先挂载本站友链，完成后在「自助提交友链」中提交申请。
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 text-sm">
        <FriendSubmitModal />
      </div>
    </div>
  )
}
