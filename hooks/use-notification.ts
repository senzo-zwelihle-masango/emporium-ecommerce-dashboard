'use client'

import { useState, useEffect } from 'react'

import {
  getNotificationsAction,
  markAllNotificationsAsReadAction,
  markNotificationAsReadAction,
  getUnreadNotificationCountAction,
} from '@/server/actions/notification/notifications'

import { Notification } from '@/interfaces/notification'
import { toast } from 'sonner'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const result = await getNotificationsAction({ take: 10 })
      if (result.success && result.notifications) {
        setNotifications(result.notifications)
      }
    } catch (error) {
      toast.error(
        `Failed to fetch notifications: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const result = await getUnreadNotificationCountAction()
      if (result.success) {
        setUnreadCount(result.count)
      }
    } catch (error) {
      toast.error(
        `Failed to fetch unread count: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const result = await markNotificationAsReadAction(id)
      if (result.success) {
        setNotifications(
          notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
        return true
      }
      return false
    } catch (error) {
      toast.error(
        `Failed to mark notification as read: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      return false
    }
  }

  const markAllAsRead = async () => {
    try {
      const result = await markAllNotificationsAsReadAction('')
      if (result.success) {
        setNotifications(notifications.map((n) => ({ ...n, read: true })))
        setUnreadCount(0)
        return true
      }
      return false
    } catch (error) {
      toast.error(
        `Failed to mark all notifications as read: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      return false
    }
  }

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()
  }, [])

  return {
    notifications,
    unreadCount,
    loading,
    refresh: fetchNotifications,
    refreshUnreadCount: fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  }
}
