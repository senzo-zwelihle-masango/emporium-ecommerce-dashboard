'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma/client'
import { auth } from '@/lib/auth'

type NotificationType =
  | 'information'
  | 'warning'
  | 'error'
  | 'success'
  | 'reminder'
  | 'alert'
  | 'message'

type PrismaUser = {
  id: string
  name: string | null
  email: string | null
}

//  user relation
type NotificationWithUser = Awaited<ReturnType<typeof prisma.notification.findMany>>[number] & {
  user: Pick<PrismaUser, 'id' | 'name' | 'email'>
}

// get user session
async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user
}

// create new notification
export async function createNotificationAction(
  message: string,
  type: NotificationType,
  relatedEntityId?: string,
  relatedEntityType?: string,
  userId?: string,
  image?: string,
  images?: string[]
): Promise<{ success: boolean; message: string }> {
  try {
    const currentUser = await getCurrentUser()

    const targetUserId = userId || currentUser?.id

    if (!targetUserId) {
      return {
        success: false,
        message: 'Authentication required to generate notifications please sign in.',
      }
    }

    await prisma.notification.create({
      data: {
        message,
        type,
        relatedEntityId: relatedEntityId || null,
        relatedEntityType: relatedEntityType || null,
        read: false,
        userId: targetUserId,
        image: image || null,
        images: images || [],
      },
    })

    revalidatePath('/notifications')
    revalidatePath('/admin/notifications')
    revalidatePath('/admin')

    if (userId) {
      revalidatePath(`/account/${userId}/notifications`)
    }

    return { success: true, message: 'Notification created successfully.' }
  } catch (error) {
    console.error('Error creating notification:', error)
    return {
      success: false,
      message: `Failed to create notification: ${
        error instanceof Error ? error.message : String(error)
      }`,
    }
  }
}

// get all notifications with proper filtering and security
export async function getNotificationsAction(params?: {
  userId?: string
  read?: boolean
  take?: number
  skip?: number
}): Promise<{
  notifications: NotificationWithUser[] | null
  success: boolean
  message?: string
}> {
  try {
    const currentUser = await getCurrentUser()

    const targetUserId = params?.userId || currentUser?.id

    if (!targetUserId) {
      return {
        notifications: null,
        success: false,
        message: 'Authentication required to view notifications.',
      }
    }

    if (params?.userId && params.userId !== currentUser?.id) {
      // Add your admin role check here if needed
      // const isAdmin = currentUser?.role === 'admin';
      // if (!isAdmin) {
      //   return {
      //     notifications: null,
      //     success: false,
      //     message: "Unauthorized to view these notifications.",
      //   };
      // }
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: targetUserId,
        ...(params?.read !== undefined && { read: params.read }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: params?.take || 50,
      skip: params?.skip || 0,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return {
      notifications: notifications as NotificationWithUser[],
      success: true,
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return {
      notifications: null,
      success: false,
      message: `Failed to fetch notifications: ${
        error instanceof Error ? error.message : String(error)
      }`,
    }
  }
}

// mark single notification as read
export async function markNotificationAsReadAction(
  notificationId: string,
  userId?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return {
        success: false,
        message: 'Authentication required.',
      }
    }

    const targetUserId = userId || currentUser.id

    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: targetUserId,
      },
    })

    if (!notification) {
      return {
        success: false,
        message: 'Notification not found or unauthorized.',
      }
    }

    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    })

    revalidatePath('/notifications')
    revalidatePath('/admin/notifications')
    revalidatePath('/admin')

    if (targetUserId) {
      revalidatePath(`/account/${targetUserId}/notifications`)
    }

    return { success: true, message: 'Notification marked as read.' }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return {
      success: false,
      message: `Failed to mark notification as read: ${
        error instanceof Error ? error.message : String(error)
      }`,
    }
  }
}

// mark all notifications as read
export async function markAllNotificationsAsReadAction(
  userId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return {
        success: false,
        message: 'Authentication required.',
      }
    }

    const targetUserId = userId || currentUser.id

    const result = await prisma.notification.updateMany({
      where: {
        userId: targetUserId,
        read: false,
      },
      data: {
        read: true,
      },
    })

    revalidatePath('/notifications')
    revalidatePath('/admin/notifications')
    revalidatePath('/admin')

    if (targetUserId) {
      revalidatePath(`/account/${targetUserId}/notifications`)
    }

    return {
      success: true,
      message: `${result.count} notifications marked as read.`,
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return {
      success: false,
      message: `Failed to mark notifications as read: ${
        error instanceof Error ? error.message : String(error)
      }`,
    }
  }
}

// new bulk mark as read
export async function bulkMarkNotificationsAsReadAction(
  notificationIds: string[]
): Promise<{ success: boolean; message: string }> {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return {
        success: false,
        message: 'Authentication required.',
      }
    }

    const notifications = await prisma.notification.findMany({
      where: {
        id: { in: notificationIds },
        userId: currentUser.id,
      },
      select: { id: true },
    })

    if (notifications.length !== notificationIds.length) {
      return {
        success: false,
        message: 'Some notifications were not found or you are not authorized to modify them.',
      }
    }

    const result = await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: currentUser.id,
      },
      data: {
        read: true,
      },
    })

    revalidatePath('/notifications')
    revalidatePath('/admin/notifications')
    revalidatePath('/admin')
    revalidatePath(`/account/${currentUser.id}/notifications`)

    return {
      success: true,
      message: `${result.count} notifications marked as read.`,
    }
  } catch (error) {
    console.error('Error bulk marking notifications as read:', error)
    return {
      success: false,
      message: `Failed to mark notifications as read: ${
        error instanceof Error ? error.message : String(error)
      }`,
    }
  }
}

// delete notification by user session
export async function deleteNotificationAction(
  notificationId: string,
  userId?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return {
        success: false,
        message: 'Authentication required.',
      }
    }

    const targetUserId = userId || currentUser.id

    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: targetUserId,
      },
    })

    if (!notification) {
      return {
        success: false,
        message: 'Notification not found or unauthorized.',
      }
    }

    await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    })

    revalidatePath('/notifications')
    revalidatePath('/admin/notifications')
    revalidatePath('/admin')

    if (targetUserId) {
      revalidatePath(`/account/${targetUserId}/notifications`)
    }

    return { success: true, message: 'Notification deleted successfully.' }
  } catch (error) {
    console.error('Error deleting notification:', error)
    return {
      success: false,
      message: `Failed to delete notification: ${
        error instanceof Error ? error.message : String(error)
      }`,
    }
  }
}

//  get unread count
export async function getUnreadNotificationCountAction(
  userId?: string
): Promise<{ count: number; success: boolean; message?: string }> {
  try {
    const currentUser = await getCurrentUser()
    const targetUserId = userId || currentUser?.id

    if (!targetUserId) {
      return {
        count: 0,
        success: false,
        message: 'Authentication required.',
      }
    }

    const count = await prisma.notification.count({
      where: {
        userId: targetUserId,
        read: false,
      },
    })

    return {
      count,
      success: true,
    }
  } catch (error) {
    console.error('Error getting unread count:', error)
    return {
      count: 0,
      success: false,
      message: 'Failed to get unread count.',
    }
  }
}

// Bulk delete notifications
export async function bulkDeleteNotificationsAction(
  notificationIds: string[]
): Promise<{ success: boolean; message: string }> {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return {
        success: false,
        message: 'Authentication required.',
      }
    }

    const notifications = await prisma.notification.findMany({
      where: {
        id: { in: notificationIds },
        userId: currentUser.id,
      },
      select: { id: true },
    })

    if (notifications.length !== notificationIds.length) {
      return {
        success: false,
        message: 'Some notifications were not found or you are not authorized to delete them.',
      }
    }

    const result = await prisma.notification.deleteMany({
      where: {
        id: { in: notificationIds },
        userId: currentUser.id,
      },
    })

    revalidatePath('/notifications')
    revalidatePath('/admin/notifications')
    revalidatePath('/admin')
    revalidatePath(`/account/${currentUser.id}/notifications`)

    return {
      success: true,
      message: `${result.count} notifications deleted successfully.`,
    }
  } catch (error) {
    console.error('Error bulk deleting notifications:', error)
    return {
      success: false,
      message: `Failed to delete notifications: ${
        error instanceof Error ? error.message : String(error)
      }`,
    }
  }
}
