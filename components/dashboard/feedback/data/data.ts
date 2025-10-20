import { ClockIcon, CheckCircleIcon, XCircleIcon, FlagIcon, ArchiveIcon } from 'lucide-react'

export const reviewStatuses = [
  {
    value: 'pending',
    label: 'Pending',
    icon: ClockIcon,
  },
  {
    value: 'approved',
    label: 'Approved',
    icon: CheckCircleIcon,
  },
  {
    value: 'rejected',
    label: 'Rejected',
    icon: XCircleIcon,
  },
  {
    value: 'flagged',
    label: 'Flagged',
    icon: FlagIcon,
  },
  {
    value: 'archived',
    label: 'Archived',
    icon: ArchiveIcon,
  },
]

export const ratings = [
  {
    value: '5',
    label: '5 Stars',
  },
  {
    value: '4',
    label: '4 Stars',
  },
  {
    value: '3',
    label: '3 Stars',
  },
  {
    value: '2',
    label: '2 Stars',
  },
  {
    value: '1',
    label: '1 Star',
  },
]
