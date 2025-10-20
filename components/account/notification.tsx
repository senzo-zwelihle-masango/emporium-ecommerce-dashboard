'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'

import {
  AlertCircleIcon,
  AlertTriangleIcon,
  BellIcon,
  CheckCircleIcon,
  InfoIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

import { UserAccountData } from '@/types/user/account/data'

interface NotificationsTabProps {
  notifications: UserAccountData['notifications']
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'information':
      return <InfoIcon className="h-4 w-4" />
    case 'warning':
      return <AlertTriangleIcon className="h-4 w-4" />
    case 'success':
      return <CheckCircleIcon className="h-4 w-4" />
    case 'error':
      return <AlertCircleIcon className="h-4 w-4" />
    default:
      return <BellIcon className="h-4 w-4" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'information':
      return 'bg-blue-600 '
    case 'warning':
      return 'bg-yellow-600 '
    case 'success':
      return 'bg-green-600 '
    case 'error':
      return 'bg-red-600 '
    default:
      return 'bg-gray-600 '
  }
}

export const NotificationsTab = ({ notifications }: NotificationsTabProps) => {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-16">
          <div>
            <BellIcon />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold">No notifications</h3>
            <p className="mx-auto max-w-sm">
              You&apos;re all caught up! Notifications about your orders and account will appear
              here.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Badge variant="secondary">{unreadCount} unread</Badge>
        </div>
      )}

      {notifications.map((notification) => (
        <Card key={notification.id} className={!notification.read ? 'border-l-4' : ''}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className={getNotificationColor(notification.type)}>
                    {getNotificationIcon(notification.type)}
                    {notification.type}
                  </Badge>
                  {!notification.read && (
                    <Badge variant="outline" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {formatDistanceToNow(notification.createdAt, {
                    addSuffix: true,
                  })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{notification.message}</p>
            {notification.relatedEntityId && (
              <div className="text-muted-foreground mt-2 text-xs">
                Related to: {notification.relatedEntityType} #{notification.relatedEntityId}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
