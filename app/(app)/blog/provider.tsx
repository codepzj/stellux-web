'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { PostVO } from '@/types/post'
import { getPostByKeyWordAPI } from '@/api/post'
import { SearchModal } from './modal'

interface SearchContextType {
  isOpen: boolean
  keyword: string
  results: PostVO[]
  loading: boolean
  hasSearched: boolean
  openSearch: () => void
  closeSearch: () => void
  setKeyword: (value: string) => void
}

const SearchContext = createContext<SearchContextType | null>(null)

export const useSearch = () => {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch 必须在 SearchProvider 中使用')
  return ctx
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
        isOpen,
        keyword,
        results,
        loading,
        hasSearched,
        openSearch,
        closeSearch,
        setKeyword,
      }}
    >
      {children}
      <SearchModal />
    </SearchContext.Provider>
  )
}
