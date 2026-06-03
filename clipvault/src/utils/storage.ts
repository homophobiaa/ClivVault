import type { Snippet } from '../types'

export async function fetchSnippets(): Promise<Snippet[]> {
  const res = await fetch('/snippets.json')
  if (!res.ok) throw new Error(`Could not load snippets.json (${res.status})`)
  const data: unknown = await res.json()
  return Array.isArray(data) ? (data as Snippet[]) : []
}
