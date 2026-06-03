import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Pin, Pencil, Trash2, Check } from 'lucide-react'
import type { Snippet } from '../types'
import { CategoryBadge } from './CategoryBadge'

interface Props {
  snippet: Snippet
  onCopy: () => void
  onPin: () => void
  onEdit: () => void
  onDelete: () => void
}

export function SnippetCard({ snippet, onCopy, onPin, onEdit, onDelete }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(snippet.content)
    setCopied(true)
    onCopy()
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className="group relative flex flex-col gap-3 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/[0.13] transition-colors duration-200"
    >
      {/* Pin indicator */}
      {snippet.pinned && (
        <span className="absolute top-3 right-3 text-amber-400 opacity-60">
          <Pin size={12} fill="currentColor" />
        </span>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 pr-4">
        <div className="flex flex-col gap-1.5 min-w-0">
          <h3 className="text-sm font-semibold text-white/90 truncate leading-snug">
            {snippet.title}
          </h3>
          <CategoryBadge category={snippet.category} />
        </div>
      </div>

      {/* Content preview */}
      <p className="text-xs text-white/40 leading-relaxed font-mono line-clamp-3 whitespace-pre-wrap break-all flex-1">
        {snippet.content}
      </p>

      {/* Actions row */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-white/20">
          {new Date(snippet.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <IconBtn onClick={onPin} title={snippet.pinned ? 'Unpin' : 'Pin'} active={snippet.pinned}>
            <Pin size={13} fill={snippet.pinned ? 'currentColor' : 'none'} />
          </IconBtn>
          <IconBtn onClick={onEdit} title="Edit">
            <Pencil size={13} />
          </IconBtn>
          <IconBtn onClick={onDelete} title="Delete" danger>
            <Trash2 size={13} />
          </IconBtn>
        </div>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleCopy}
          title="Copy to clipboard"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300'
          }`}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </motion.button>
      </div>
    </motion.div>
  )
}

function IconBtn({
  children,
  onClick,
  title,
  danger,
  active,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  danger?: boolean
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-colors ${
        danger
          ? 'text-white/30 hover:text-red-400 hover:bg-red-400/10'
          : active
          ? 'text-amber-400 hover:bg-amber-400/10'
          : 'text-white/30 hover:text-white/70 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  )
}
