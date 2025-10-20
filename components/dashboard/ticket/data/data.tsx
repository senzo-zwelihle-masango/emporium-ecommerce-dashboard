import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Clock,
  XCircle,
  Flag,
  CircleDot,
  MessageSquare,
} from 'lucide-react'

export const statuses = [
  {
    value: 'open',
    label: 'Open',
    icon: CircleDot,
  },
  {
    value: 'pending',
    label: 'Pending',
    icon: Clock,
  },
  {
    value: 'closed',
    label: 'Closed',
    icon: XCircle,
  },
  {
    value: 'reopened',
    label: 'Reopened',
    icon: MessageSquare,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: ArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: ArrowRight,
  },
  {
    label: 'High',
    value: 'high',
    icon: ArrowUp,
  },
  {
    label: 'Urgent',
    value: 'urgent',
    icon: Flag,
  },
]
