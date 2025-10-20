'use client'

import { useNotificationContext } from '@/components/providers/notification-provider'

export function NotificationBadge() {
  const { unreadCount } = useNotificationContext()

  if (unreadCount === 0) return null

  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )
}
