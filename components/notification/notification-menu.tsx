'use client'

import { BellIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useNotifications } from '@/hooks/use-notification'

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  )
}

const NotificationMenu = () => {
  const { notifications, unreadCount, loading, markAllAsRead, markAsRead } = useNotifications()

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const handleNotificationClick = async (id: string) => {
    await markAsRead(id)
  }

  const formatTimeAgo = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-9 rounded-full shadow-none"
          aria-label="Open notifications"
        >
          <BellIcon aria-hidden="true" className="size-4" />
          {unreadCount > 0 && (
            <div
              aria-hidden="true"
              className="bg-tall-poppy-600 absolute top-0.5 right-0.5 size-1 rounded-full"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">Notifications</div>
          {unreadCount > 0 && (
            <button className="text-xs font-medium hover:underline" onClick={handleMarkAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="bg-border -mx-1 my-1 h-px"
        ></div>
        <ScrollArea className="h-96">
          {loading ? (
            <div className="px-3 py-2 text-sm">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-muted-foreground px-3 py-2 text-sm">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
              >
                <div className="relative flex items-start pe-3">
                  <div className="flex-1 space-y-1">
                    <button
                      className="text-foreground/80 text-left after:absolute after:inset-0"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <span className="text-foreground font-medium hover:underline">
                        {notification.message}
                      </span>
                    </button>
                    <div className="text-muted-foreground text-xs">
                      {formatTimeAgo(notification.createdAt)}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="absolute end-0 self-center">
                      <span className="sr-only">Unread</span>
                      <Dot />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationMenu
