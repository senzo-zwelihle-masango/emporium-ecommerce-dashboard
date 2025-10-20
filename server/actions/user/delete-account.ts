'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { auth } from '@/lib/auth'

import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

const deleteAccountSchema = z.object({
  userId: z.string(),
})

export async function deleteAccountAction(
  data: z.infer<typeof deleteAccountSchema>
): Promise<ApiResponse> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return { status: 'error', message: 'Authentication required.' }
  }

  // Verify that the user is deleting their own account
  if (session.user.id !== data.userId) {
    return { status: 'error', message: 'Unauthorized action.' }
  }

  try {
    const result = deleteAccountSchema.safeParse(data)
    if (!result.success) {
      return { status: 'error', message: 'Invalid data provided.' }
    }

    // Delete the user account
    await prisma.user.delete({
      where: { id: data.userId },
    })

    return { status: 'success', message: 'Account deleted successfully.' }
  } catch {
    return {
      status: 'error',
      message: 'Failed to delete account. Please try again.',
    }
  }
}
