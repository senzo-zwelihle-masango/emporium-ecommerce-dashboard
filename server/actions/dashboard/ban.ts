'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

// Check and unban expired bans
export async function checkExpiredBansAction(): Promise<ApiResponse> {
  try {
    // Get session from headers
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    // Check if user has a session
    if (!session) {
      return { status: 'error', message: 'Unauthorized' }
    }

    // Find users with expired bans
    const expiredBans = await prisma.user.findMany({
      where: {
        banned: true,
        banExpires: {
          not: null,
          lt: new Date(),
        },
      },
    })

    if (expiredBans.length === 0) {
      return { status: 'success', message: 'No expired bans found' }
    }

    // Unban users with expired bans
    const unbannedUsers = await Promise.all(
      expiredBans.map(async (user) => {
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            banned: false,
            banReason: null,
            banExpires: null,
          },
        })

        await createNotificationAction(
          'Your ban has expired and your account has been reinstated.',
          NotificationType.success,
          user.id,
          'User',
          session.user.id
        )

        return updatedUser
      })
    )

    return {
      status: 'success',
      message: `Unbanned ${unbannedUsers.length} users with expired bans`,
    }
  } catch {
    return { status: 'error', message: 'Failed to check expired bans' }
  }
}
