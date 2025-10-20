'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useNotifications } from '@/hooks/use-notification'

type NotificationContextType = ReturnType<typeof useNotifications>

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notificationHook = useNotifications()

  return (
    <NotificationContext.Provider value={notificationHook}>{children}</NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider')
  }
  return context
}
