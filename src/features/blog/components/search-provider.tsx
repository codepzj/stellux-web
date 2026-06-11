'use client'

import React, { createContext, use, useState, useEffect, useCallback } from 'react'
import { PostVO } from '@/entities/post/types'
import { getPostByKeyWordAPI } from '@/entities/post/api'
import { SearchModal } from './search-modal'

interface SearchState {
  isOpen: boolean
  keyword: string
  results: PostVO[]
  loading: boolean
  hasSearched: boolean
}

interface SearchActions {
  openSearch: () => void
  closeSearch: () => void
  setKeyword: (value: string) => void
}

type SearchContextType = {
  state: SearchState
  actions: SearchActions
}

const SearchContext = createContext<SearchContextType | null>(null)

export const useSearch = () => {
  const ctx = use(SearchContext)
  if (!ctx) throw new Error('useSearch 必须在 SearchProvider 中使用')
  return {
    ...ctx.state,
    ...ctx.actions,
  }
}

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<PostVO[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const searchPosts = useCallback(async (searchKeyword: string) => {
    if (!searchKeyword.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }
    setLoading(true)
    try {
      const res = await getPostByKeyWordAPI(searchKeyword)
      setResults(res.data || [])
      setHasSearched(true)
    } finally {
      setLoading(false)
    }
  }, [])

  // 防抖搜索，延迟800ms，至少1个字符才搜索
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (keyword.trim().length >= 1) {
        searchPosts(keyword)
      } else {
        setResults([])
        setHasSearched(false)
      }
    }, 450)

    return () => clearTimeout(debounceTimer)
  }, [keyword, searchPosts])

  const openSearch = () => setIsOpen(true)
  const closeSearch = () => {
    setIsOpen(false)
    setKeyword('')
    setResults([])
    setHasSearched(false)
  }

  return (
    <SearchContext.Provider
      value={{
        state: {
          isOpen,
          keyword,
          results,
          loading,
          hasSearched,
        },
        actions: {
          openSearch,
          closeSearch,
          setKeyword,
        },
      }}
    >
      {children}
      <SearchModal />
    </SearchContext.Provider>
  )
}
