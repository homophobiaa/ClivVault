import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { Category, Snippet } from '../types'

const CATEGORIES: Category[] = ['Prompts', 'Links', 'Commands', 'School', 'Business', 'Personal', 'Other']

interface Props {
  open: boolean
  initial?: Snippet | null
  onClose: () => void
  onSave: (data: { title: string; content: string; category: Category }) => void
}

export function SnippetModal({ open, initial, onClose, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<Category>('Personal')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? '')
      setContent(initial?.content ?? '')
      setCategory(initial?.category ?? 'Personal')
      setTimeout(() => titleRef.current?.focus(), 80)
    }
  }, [open, initial])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    onSave({ title: title.trim(), content: content.trim(), category })
    onClose()
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose()
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e as unknown as React.FormEvent)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 mx-auto max-w-lg"
            onKeyDown={handleKey}
          >
            <div className="rounded-2xl border border-white/[0.1] bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white/90">
                  {initial ? 'Edit snippet' : 'New snippet'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/40">Title</label>
                  <input
                    ref={titleRef}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="My snippet…"
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/40">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          category === cat
                            ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                            : 'bg-white/[0.04] border-white/[0.07] text-white/40 hover:bg-white/[0.08] hover:text-white/60'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/40">Content</label>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Paste or type your snippet…"
                    required
                    rows={6}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white/80 placeholder-white/20 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 resize-none font-mono transition-all"
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-white/20">⌘↵ to save</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-500/20"
                    >
                      {initial ? 'Save changes' : 'Add snippet'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
