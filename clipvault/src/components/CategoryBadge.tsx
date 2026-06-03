import type { Category } from '../types'

const COLOR: Record<Category, string> = {
  Prompts:  'bg-violet-500/15 text-violet-300 ring-violet-500/30',
  Links:    'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  Commands: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  School:   'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  Business: 'bg-blue-500/15 text-blue-300 ring-blue-500/30',
  Personal: 'bg-pink-500/15 text-pink-300 ring-pink-500/30',
  Other:    'bg-zinc-500/15 text-zinc-400 ring-zinc-500/30',
}

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ring-1 ${COLOR[category]}`}>
      {category}
    </span>
  )
}
