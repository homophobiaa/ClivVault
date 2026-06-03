import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Search, Clipboard, X, Download, AlertCircle } from 'lucide-react'
import { useSnippets } from './hooks/useSnippets'
import { useToast } from './hooks/useToast'
import { SnippetCard } from './components/SnippetCard'
import { SnippetModal } from './components/SnippetModal'
import { ConfirmDialog } from './components/ConfirmDialog'
import { ToastContainer } from './components/ToastContainer'
import { EmptyState } from './components/EmptyState'
import { ExportModal } from './components/ExportModal'
import type { Category, Snippet } from './types'

const CATEGORIES: Array<Category | 'All'> = [
  'All', 'Prompts', 'Links', 'Commands', 'School', 'Business', 'Personal', 'Other',
]

export default function App() {
  const {
    snippets, allSnippets, allCount, loading, error,
    query, setQuery,
    activeCategory, setActiveCategory,
    addSnippet, updateSnippet, deleteSnippet, togglePin,
  } = useSnippets()

  const { toasts, addToast, removeToast } = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Snippet | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        setEditTarget(null)
        setModalOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function openNew() {
    setEditTarget(null)
    setModalOpen(true)
  }

  function openEdit(snippet: Snippet) {
    setEditTarget(snippet)
    setModalOpen(true)
  }

  function handleSave(data: { title: string; content: string; category: Category }) {
    if (editTarget) {
      updateSnippet(editTarget.id, data)
      addToast('Snippet updated')
    } else {
      addSnippet(data)
      addToast('Snippet created')
    }
  }

  function handleDelete(id: string) {
    deleteSnippet(id)
    setDeleteTarget(null)
    addToast('Snippet deleted', 'error')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="p-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30">
              <Clipboard size={16} className="text-indigo-400" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white/90">ClipVault</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search snippets… (⌘K)"
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-white/25 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/15 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setExportOpen(true)}
              title="Export snippets.json"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white/50 hover:text-white/80 text-sm font-medium transition-colors"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={openNew}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">New</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-white/30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white/10 border-t-indigo-500 rounded-full"
            />
            <span className="text-sm">Loading snippets…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-red-500/20 bg-red-500/8 text-red-400 text-sm">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Stats + category filter */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/30 font-medium">
                {snippets.length === allCount
                  ? `${allCount} snippet${allCount !== 1 ? 's' : ''}`
                  : `${snippets.length} of ${allCount} snippet${allCount !== 1 ? 's' : ''}`}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'bg-white/[0.04] text-white/35 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Snippet grid */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <AnimatePresence mode="popLayout">
                {snippets.length === 0 ? (
                  <EmptyState hasQuery={!!query || activeCategory !== 'All'} onNew={openNew} />
                ) : (
                  snippets.map(snippet => (
                    <SnippetCard
                      key={snippet.id}
                      snippet={snippet}
                      onCopy={() => addToast('Copied to clipboard!')}
                      onPin={() => togglePin(snippet.id)}
                      onEdit={() => openEdit(snippet)}
                      onDelete={() => setDeleteTarget(snippet.id)}
                    />
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </main>

      <SnippetModal
        open={modalOpen}
        initial={editTarget}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete snippet?"
        description="This action cannot be undone."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <ExportModal
        open={exportOpen}
        snippets={allSnippets}
        onClose={() => setExportOpen(false)}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
