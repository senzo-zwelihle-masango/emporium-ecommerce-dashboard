'use client'

import { useEffect, useState, useTransition, useCallback } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  deleteNotificationAction,
  getNotificationsAction,
  markNotificationAsReadAction,
  bulkMarkNotificationsAsReadAction,
  bulkDeleteNotificationsAction,
} from '@/server/actions/notification/notifications'
import {
  BellDotIcon,
  CheckCircle2Icon,
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  MoreVerticalIcon,
  SearchIcon,
  SortAscIcon,
  SortDescIcon,
  Trash2Icon,
} from 'lucide-react'
import Image from 'next/image'

type Notification = {
  id: string
  message: string
  type: string
  read: boolean
  createdAt: Date
  image?: string | null
  images?: string[]
}

const typeBadges: Record<string, string> = {
  Information: 'bg-blue-500 text-white',
  Warning: 'bg-yellow-500 text-white',
  Error: 'bg-red-500 text-white',
  Success: 'bg-green-500 text-white',
  Reminder: 'bg-purple-500 text-white',
  Alert: 'bg-orange-500 text-white',
  Message: 'bg-gray-500 text-white',
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[] | null>(null)
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'all' | 'unread'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'type'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isPending, startTransition] = useTransition()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null)

  const loadNotifications = useCallback(async () => {
    const result = await getNotificationsAction({
      read: tab === 'unread' ? false : undefined,
    })
    if (result.success && result.notifications) {
      setNotifications(result.notifications)
    }
  }, [tab])

  useEffect(() => {
    startTransition(() => {
      loadNotifications()
    })
  }, [loadNotifications])

  const filtered = notifications
    ?.filter((n) => {
      if (search && !n.message.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      if (typeFilter !== 'all' && n.type !== typeFilter) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy === 'date') {
        // Now comparing Date objects directly
        comparison = a.createdAt.getTime() - b.createdAt.getTime()
      } else if (sortBy === 'type') {
        comparison = a.type.localeCompare(b.type)
      }
      return sortOrder === 'desc' ? -comparison : comparison
    })

  const unreadCount = notifications?.filter((n) => !n.read).length || 0

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(filtered?.map((n) => n.id) || [])
    } else {
      setSelectedNotifications([])
    }
  }

  const handleSelectNotification = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedNotifications((prev) => [...prev, id])
    } else {
      setSelectedNotifications((prev) => prev.filter((nId) => nId !== id))
    }
  }

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsReadAction(id)
    loadNotifications()
  }

  const handleBulkMarkAsRead = async () => {
    await bulkMarkNotificationsAsReadAction(selectedNotifications)
    setSelectedNotifications([])
    loadNotifications()
  }

  const handleDelete = async (id: string) => {
    await deleteNotificationAction(id)
    loadNotifications()
    setDeleteDialogOpen(false)
    setNotificationToDelete(null)
  }

  const handleBulkDelete = async () => {
    await bulkDeleteNotificationsAction(selectedNotifications)
    setSelectedNotifications([])
    setDeleteDialogOpen(false)
    loadNotifications()
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString()
  }
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="notifications"
      className="my-4 space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <Heading
              size={'5xl'}
              spacing={'normal'}
              lineHeight={'none'}
              weight={'bold'}
              margin={'none'}
            >
              Notifications
            </Heading>
            <p className="text-muted-foreground text-sm">
              Stay updated with your latest activities
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search notifications..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.keys(typeBadges).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {sortOrder === 'desc' ? (
                  <SortDescIcon className="h-4 w-4" />
                ) : (
                  <SortAscIcon className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSortBy('date')
                  setSortOrder('desc')
                }}
              >
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy('date')
                  setSortOrder('asc')
                }}
              >
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy('type')
                  setSortOrder('asc')
                }}
              >
                Type A-Z
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs
        value={tab}
        // FIX 2: Correctly type the onValueChange handler
        onValueChange={(val) => setTab(val as 'all' | 'unread')}
        className="bg-background"
      >
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            All
            <Badge variant="secondary" className="text-xs">
              {notifications?.length || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center gap-2">
            Unread
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {selectedNotifications.length > 0 && (
        <Card className="bg-background p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedNotifications.length === (filtered?.length || 0)}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">{selectedNotifications.length} selected</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleBulkMarkAsRead}>
                <CheckCircleIcon className="mr-2 h-4 w-4" />
                Mark Read
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isPending || !notifications ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <Card className="bg-background p-12 text-center">
          <BellDotIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No notifications found</h3>
          <p className="text-muted-foreground">
            {search ? 'Try adjusting your search or filters' : "You're all caught up!"}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered?.map((n) => {
            const isSelected = selectedNotifications.includes(n.id)
            return (
              <Card
                key={n.id}
                className={`bg-background transition-all duration-200 hover:shadow-md ${
                  !n.read ? 'border-l-4' : ''
                } ${isSelected ? 'ring-2' : ''}`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectNotification(n.id, checked as boolean)
                      }
                      className="mt-1"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge className={typeBadges[n.type] || ''}>{n.type}</Badge>
                            {!n.read && <div className="h-2 w-2 rounded-full" />}
                          </div>
                          <CardTitle
                            className={`mb-2 text-base ${
                              !n.read ? 'font-semibold' : 'text-muted-foreground font-normal'
                            }`}
                          >
                            {n.message}
                          </CardTitle>

                          {n.image && (
                            <Image
                              src={n.image}
                              alt="Notification image"
                              width={24}
                              height={24}
                              unoptimized
                              className="mt-2 h-24 w-24 rounded-md object-contain"
                            />
                          )}
                          {n.images && n.images.length > 0 && (
                            <div className="mt-2 flex gap-2 overflow-x-auto">
                              {n.images.map((imgSrc, index) => (
                                <Image
                                  key={index}
                                  src={imgSrc}
                                  alt={`Notification image ${index + 1}`}
                                  width={64}
                                  height={64}
                                  unoptimized
                                  className="h-16 w-16 rounded-md object-contain"
                                />
                              ))}
                            </div>
                          )}

                          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                            <ClockIcon className="h-3 w-3" />
                            <span>
                              {/* Now formatting a Date object */}
                              {formatRelativeTime(n.createdAt.toISOString())}
                            </span>
                            <span>•</span>
                            <span>{n.createdAt.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!n.read && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsRead(n.id)}
                            >
                              Mark as Read
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVerticalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!n.read ? (
                                <DropdownMenuItem onClick={() => handleMarkAsRead(n.id)}>
                                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                                  Mark as Read
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem disabled>
                                  <CircleIcon className="mr-2 h-4 w-4" />
                                  Already Read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setNotificationToDelete(n.id)
                                  setDeleteDialogOpen(true)
                                }}
                                className="text-destructive"
                              >
                                <Trash2Icon className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notifications</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              {selectedNotifications.length > 0
                ? `${selectedNotifications.length} notifications`
                : 'this notification'}
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedNotifications.length > 0) {
                  handleBulkDelete()
                } else if (notificationToDelete) {
                  handleDelete(notificationToDelete)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  )
}

export default NotificationsPage
