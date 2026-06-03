export type Category =
  | 'Prompts'
  | 'Links'
  | 'Commands'
  | 'School'
  | 'Business'
  | 'Personal'
  | 'Other'

export interface Snippet {
  id: string
  title: string
  content: string
  category: Category
  pinned: boolean
  createdAt: number
  updatedAt: number
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error'
}
