import { motion } from 'framer-motion'
import { Clipboard } from 'lucide-react'

interface Props {
  hasQuery: boolean
  onNew: () => void
}

export function EmptyState({ hasQuery, onNew }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-24 gap-4 text-center"
    >
      <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-white/20">
        <Clipboard size={28} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-white/40">
          {hasQuery ? 'No snippets match your search' : 'No snippets yet'}
        </p>
        <p className="text-xs text-white/20">
          {hasQuery ? 'Try a different keyword or category' : 'Create your first snippet to get started'}
        </p>
      </div>
      {!hasQuery && (
        <button
          onClick={onNew}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
        >
          New snippet
        </button>
      )}
    </motion.div>
  )
}
