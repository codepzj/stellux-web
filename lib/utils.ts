import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 博客 / 文档列表卡片：细边框、轻阴影、悬停略抬升层次，保持简约 */
export const contentListCardClassName =
  'group relative cursor-pointer overflow-hidden rounded-xl border border-border/80 bg-white/90 p-4 shadow-sm shadow-black/5 transition-[box-shadow,border-color,background-color] duration-200 ease-out hover:border-border hover:bg-muted/40 hover:shadow-md hover:shadow-black/10 dark:bg-card/80 dark:shadow-black/20 dark:hover:bg-card/95 dark:hover:shadow-lg dark:hover:shadow-black/40 motion-reduce:transition-none'
