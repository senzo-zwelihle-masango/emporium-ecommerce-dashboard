export type NoteTag =
  | 'idea'
  | 'todo'
  | 'inspiration'
  | 'reminder'
  | 'task'
  | 'note'
  | 'journal'
  | 'thought'
  | string

export type NoteStatus = 'draft' | 'inprogress' | 'review' | 'final' | 'archived' | string

export type NoteAction = 'urgent' | 'important' | 'lowPriority' | string

export function NoteTagColor(tag: NoteTag): {
  label: string
  color: string
} {
  switch (tag) {
    case 'idea':
      return { label: 'idea', color: 'bg-green-700' }

    case 'todo':
      return { label: 'todo', color: 'bg-red-700' }

    case 'inspiration':
      return { label: 'inspiration', color: 'bg-yellow-700' }

    case 'reminder':
      return { label: 'reminder', color: 'bg-orange-700' }

    case 'task':
      return { label: 'task', color: 'bg-blue-700' }

    case 'note':
      return { label: 'note', color: 'bg-purple-700' }

    case 'journal':
      return { label: 'journal', color: 'bg-pink-700' }

    case 'thought':
      return { label: 'thought', color: 'bg-teal-700' }

    default:
      return {
        label: tag,
        color: 'bg-gray-700',
      }
  }
}

export function NoteStatusColor(status: NoteStatus): {
  label: string
  color: string
} {
  switch (status) {
    case 'draft':
      return { label: 'draft', color: 'bg-gray-700' }

    case 'inprogress':
      return { label: 'inprogress', color: 'bg-amber-700' }

    case 'review':
      return { label: 'review', color: 'bg-blue-700' }

    case 'final':
      return { label: 'final', color: 'bg-green-700' }

    case 'archived':
      return { label: 'archived', color: 'bg-slate-700' }

    default:
      return {
        label: status,
        color: 'bg-gray-700',
      }
  }
}

export function NoteActionColor(action: NoteAction): {
  label: string
  color: string
} {
  switch (action) {
    case 'urgent':
      return { label: 'urgent', color: 'bg-red-700' }

    case 'important':
      return { label: 'important', color: 'bg-amber-700' }

    case 'lowpriority':
      return { label: 'lowpriority', color: 'bg-blue-700' }

    default:
      return {
        label: action,
        color: 'bg-gray-700',
      }
  }
}
