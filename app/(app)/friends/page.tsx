import { FriendShowVO, getFriendListAPI } from '@/api/friend'
import FriendCard from '@/components/Friends/FriendCard'
import FriendSubmitModal from '@/components/Friends/FriendSubmitModal'
import { ContentListPageHeader } from '@/components/ContentList/page-header'
import { BLOG_CONTENT_MAX_CLASS } from '@/lib/blog-layout'
import { cn } from '@/lib/utils'
import { Info, UsersRound } from 'lucide-react'

export const dynamic = 'force-dynamic'

const FRIEND_TYPES = [
  { value: 0, label: '大佬', description: '长期输出与值得反复阅读的站点' },
  { value: 1, label: '技术型', description: '工程、架构与技术实践相关的朋友' },
  { value: 2, label: '设计型', description: '审美、产品与体验灵感的来源' },
  { value: 3, label: '生活型', description: '记录日常、观点与个人表达的角落' },
] as const

export default async function FriendsPage() {
  const { data } = await getFriendListAPI()
  const friendList: FriendShowVO[] = data || []

  const groups: Record<number, typeof friendList> = { 0: [], 1: [], 2: [], 3: [] }
  friendList?.forEach((f) => {
    const t = f.website_type as number
    if (t in groups) groups[t]!.push(f)
  })

  return (
    <main className="relative bg-background">
      <div className="container mx-auto px-4 py-10 md:px-6 md:py-16">
        <div className={cn('mx-auto w-full space-y-8', BLOG_CONTENT_MAX_CLASS)}>
          <ContentListPageHeader
            eyebrow="Friends"
            title="友链"
            description="一些认真写作、持续创造，或者单纯让人想常去看看的站点。"
            meta={{
              icon: UsersRound,
              label: `${friendList.length} 个站点`,
            }}
            trailing={
              <div className="flex justify-start text-sm md:justify-end">
                <FriendSubmitModal />
              </div>
            }
          />

          {friendList.length > 0 ? (
            <div className="space-y-10">
              {FRIEND_TYPES.map((type) => {
                const friends = groups[type.value]

                return friends && friends.length > 0 ? (
                  <section key={type.value} className="space-y-4">
                    <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/50 pb-3">
                      <div className="space-y-1">
                        <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                          {type.label}
                        </h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                      <span className="rounded-md border border-border/70 bg-muted/35 px-2 py-1 text-xs text-muted-foreground tabular-nums">
                        {friends.length} 个
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {friends.map((friend) => (
                        <FriendCard key={`${friend.site_url}-${friend.name}`} friend={friend} />
                      ))}
                    </div>
                  </section>
                ) : null
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-5 py-10 text-center">
              <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                暂时还没有友链
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                欢迎把你的站点投递过来，审核后会展示在这里。
              </p>
            </div>
          )}

          <div className="rounded-xl border border-border/70 bg-muted/25 p-4 md:p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0 space-y-2">
                <div className="font-medium text-foreground">友链交换规则</div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  每月持续输出内容；请先挂载本站友链，完成后在「自助提交友链」中提交申请。
                </p>
                <div className="text-sm">
                  <FriendSubmitModal />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
