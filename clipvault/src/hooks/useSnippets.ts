import { useState, useCallback, useMemo, useEffect } from 'react'
import type { Snippet, Category } from '../types'
import { fetchSnippets } from '../utils/storage'

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')

  useEffect(() => {
    fetchSnippets()
      .then(setSnippets)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const addSnippet = useCallback(
    (data: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt' | 'pinned'>) => {
      const now = Date.now()
      const snippet: Snippet = { ...data, id: genId(), pinned: false, createdAt: now, updatedAt: now }
      setSnippets(prev => [snippet, ...prev])
    },
    [],
  )

  const updateSnippet = useCallback(
    (id: string, data: Partial<Omit<Snippet, 'id' | 'createdAt'>>) => {
      setSnippets(prev =>
        prev.map(s => (s.id === id ? { ...s, ...data, updatedAt: Date.now() } : s)),
      )
    },
    [],
  )

  const deleteSnippet = useCallback((id: string) => {
    setSnippets(prev => prev.filter(s => s.id !== id))
  }, [])

  const togglePin = useCallback((id: string) => {
    setSnippets(prev =>
      prev.map(s => (s.id === id ? { ...s, pinned: !s.pinned, updatedAt: Date.now() } : s)),
    )
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return snippets
      .filter(s => {
        const matchCat = activeCategory === 'All' || s.category === activeCategory
        const matchQ = !q || s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
        return matchCat && matchQ
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return b.updatedAt - a.updatedAt
      })
  }, [snippets, query, activeCategory])

  return {
    snippets: filtered,
    allSnippets: snippets,
    allCount: snippets.length,
    loading,
    error,
    query,
    setQuery,
    activeCategory,
    setActiveCategory,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    togglePin,
  }
}
