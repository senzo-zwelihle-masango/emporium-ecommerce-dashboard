'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { banUserSchema, BanUserSchemaType } from '@/schemas/dashboard/ban'

// Ban user
export async function banUserAction(
  userId: string,
  values: BanUserSchemaType
): Promise<ApiResponse> {
  try {
    // Get session from headers
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    // Check if user is admin
    if (!session) {
      return { status: 'error', message: 'Unauthorized' }
    }

    const validation = banUserSchema.safeParse(values)
    if (!validation.success) {
      return { status: 'error', message: 'Invalid form data' }
    }

    const banData = {
      banned: true,
      banReason: validation.data.banReason,
      banExpires: validation.data.banExpires ?? null,
    }

    await prisma.user.update({
      where: { id: userId },
      data: banData,
    })

    // Create a more detailed notification message
    let notificationMessage = `User has been banned. Reason: ${validation.data.banReason}`
    if (validation.data.banExpires) {
      notificationMessage += ` Ban expires on ${validation.data.banExpires.toLocaleDateString()}.`
    }

    await createNotificationAction(
      notificationMessage,
      NotificationType.warning,
      userId,
      'User',
      session.user.id
    )

    return { status: 'success', message: 'User banned successfully' }
  } catch {
    return { status: 'error', message: 'Failed to ban user' }
  }
}

// Unban user
export async function unbanUserAction(userId: string): Promise<ApiResponse> {
  try {
    // Get session from headers
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    // Check if user is admin
    if (!session) {
      return { status: 'error', message: 'Unauthorized' }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        banned: false,
        banReason: null,
        banExpires: null,
      },
    })

    await createNotificationAction(
      `User has been unbanned.`,
      NotificationType.success,
      userId,
      'User',
      session.user.id
    )

    return { status: 'success', message: 'User unbanned successfully' }
  } catch {
    return { status: 'error', message: 'Failed to unban user' }
  }
}

// Delete user
export async function deleteUserAction(userId: string): Promise<ApiResponse> {
  try {
    // Get session from headers
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    // Check if user is admin
    if (!session) {
      return { status: 'error', message: 'Unauthorized' }
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    })

    await createNotificationAction(
      `Successfully deleted user "${deletedUser.name}".`,
      NotificationType.success,
      deletedUser.id,
      'User',
      session.user.id
    )

    return { status: 'success', message: 'User deleted successfully' }
  } catch {
    return { status: 'error', message: 'Failed to delete user' }
  }
}
