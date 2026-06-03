import { useState, useCallback, useMemo } from 'react'
import type { Snippet, Category } from '../types'
import { loadSnippets, saveSnippets } from '../utils/storage'

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>(() => loadSnippets())
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')

  const persist = useCallback((next: Snippet[]) => {
    setSnippets(next)
    saveSnippets(next)
  }, [])

  const addSnippet = useCallback(
    (data: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt' | 'pinned'>) => {
      const now = Date.now()
      const snippet: Snippet = { ...data, id: genId(), pinned: false, createdAt: now, updatedAt: now }
      persist([snippet, ...snippets])
    },
    [snippets, persist],
  )

  const updateSnippet = useCallback(
    (id: string, data: Partial<Omit<Snippet, 'id' | 'createdAt'>>) => {
      persist(
        snippets.map(s => (s.id === id ? { ...s, ...data, updatedAt: Date.now() } : s)),
      )
    },
    [snippets, persist],
  )

  const deleteSnippet = useCallback(
    (id: string) => {
      persist(snippets.filter(s => s.id !== id))
    },
    [snippets, persist],
  )

  const togglePin = useCallback(
    (id: string) => {
      persist(
        snippets.map(s => (s.id === id ? { ...s, pinned: !s.pinned, updatedAt: Date.now() } : s)),
      )
    },
    [snippets, persist],
  )

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return snippets
      .filter(s => {
        const matchCat = activeCategory === 'All' || s.category === activeCategory
        const matchQ =
          !q || s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
        return matchCat && matchQ
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return b.updatedAt - a.updatedAt
      })
  }, [snippets, query, activeCategory])

  return {
    snippets: filtered,
    allCount: snippets.length,
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
