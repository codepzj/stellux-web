'use client'

import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AdminPaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
}

function getPageItems(page: number, pageCount: number) {
  const items: Array<number | 'ellipsis'> = []
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)

  items.push(1)
  if (start > 2) items.push('ellipsis')
  for (let item = start; item <= end; item += 1) {
    items.push(item)
  }
  if (end < pageCount - 1) items.push('ellipsis')
  if (pageCount > 1) items.push(pageCount)

  return items
}

export function AdminPagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: AdminPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(page, 1), pageCount)
  const pageItems = getPageItems(currentPage, pageCount)
  const canPrevious = currentPage > 1
  const canNext = currentPage < pageCount

  const go = (nextPage: number) => (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event.preventDefault()
    const normalized = Math.min(Math.max(nextPage, 1), pageCount)
    if (normalized !== currentPage) onPageChange(normalized)
  }

  return (
    <div className="mt-auto flex w-full justify-end py-4">
      <Pagination className="mx-0 ml-auto mr-0 w-fit justify-end">
        <PaginationContent className="max-w-full justify-end gap-1 sm:gap-1">
          <PaginationItem>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={!canPrevious}
              onClick={go(currentPage - 1)}
              aria-label="上一页"
            >
              <ChevronLeftIcon data-icon="icon" />
            </Button>
          </PaginationItem>
          {pageItems.map((item, index) => (
            <PaginationItem key={`${item}-${index}`}>
              {item === 'ellipsis' ? (
                <PaginationEllipsis className="size-8" />
              ) : (
                <Button
                  type="button"
                  variant={item === currentPage ? 'outline' : 'ghost'}
                  size="icon-sm"
                  aria-current={item === currentPage ? 'page' : undefined}
                  onClick={go(item)}
                >
                  {item}
                </Button>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={!canNext}
              onClick={go(currentPage + 1)}
              aria-label="下一页"
            >
              <ChevronRightIcon data-icon="icon" />
            </Button>
          </PaginationItem>
          {onPageSizeChange && (
            <PaginationItem>
              <Select
                value={String(pageSize)}
                onValueChange={value => onPageSizeChange(Number(value))}
              >
                <SelectTrigger size="sm" className="ml-1 w-28 justify-between shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectGroup>
                    {pageSizeOptions.map(option => (
                      <SelectItem key={option} value={String(option)}>
                        {option}条/页
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
