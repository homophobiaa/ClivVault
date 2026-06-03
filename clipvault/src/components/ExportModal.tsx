import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check } from 'lucide-react'
import type { Snippet } from '../types'

interface Props {
  open: boolean
  snippets: Snippet[]
  onClose: () => void
}

export function ExportModal({ open, snippets, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  const json = JSON.stringify(snippets, null, 2)

  function handleCopy() {
    navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 mx-auto max-w-2xl"
          >
            <div className="rounded-2xl border border-white/[0.1] bg-zinc-900/98 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-sm font-semibold text-white/90">Export JSON</h2>
                  <p className="text-[11px] text-white/35">
                    Copy this JSON and paste it into <code className="font-mono text-white/50">public/snippets.json</code>, then redeploy.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors shrink-0 ml-4"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Code block */}
              <div className="overflow-auto flex-1 p-4">
                <pre className="text-xs text-emerald-300/80 font-mono leading-relaxed whitespace-pre">
                  {json}
                </pre>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06] shrink-0 bg-zinc-900/50">
                <span className="text-[11px] text-white/25">
                  {snippets.length} snippet{snippets.length !== 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
                  >
                    Close
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    }`}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
