import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 博客 / 文档列表卡片：轻边框与阴影，悬停略抬升层次 */
export const contentListCardClassName =
  'group relative cursor-pointer overflow-hidden rounded-xl border border-border/70 bg-card/90 p-4 shadow-sm shadow-black/[0.04] transition-[box-shadow,border-color,background-color] duration-200 ease-out hover:border-border hover:bg-muted/35 hover:shadow-md hover:shadow-black/[0.07] dark:bg-card/75 dark:shadow-black/25 dark:hover:bg-card/90 dark:hover:shadow-lg dark:hover:shadow-black/35 motion-reduce:transition-none'
