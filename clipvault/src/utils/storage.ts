import type { Snippet } from '../types'

const KEY = 'clipvault_snippets'

export function loadSnippets(): Snippet[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSnippets(snippets: Snippet[]): void {
  localStorage.setItem(KEY, JSON.stringify(snippets))
}
