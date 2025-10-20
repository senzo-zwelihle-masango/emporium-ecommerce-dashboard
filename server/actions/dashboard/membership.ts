'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { MembershipSchemaType, membershipSchema } from '@/schemas/dashboard/membership'

// new
export async function createMembershipAction(values: MembershipSchemaType): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  //   mutation
  try {
    // schema validation
    const validation = membershipSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const newMembership = await prisma.membership.create({
      data: {
        ...validation.data,
      },
    })

    // create notification
    await createNotificationAction(
      `Successfully created ${newMembership.title} membership.`,
      NotificationType.success,
      newMembership.id,
      'Membership',
      // Send notification to the user
      session.user.id
    )
    return {
      status: 'success',
      message: 'Membership Created Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to add a new membership. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to create membership',
    }
  }
}

// update
export async function updateMembershipAction(
  data: MembershipSchemaType,
  membershipId: string
): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // schema validation
    const result = membershipSchema.safeParse(data)

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const updateMembership = await prisma.membership.update({
      where: {
        id: membershipId,
      },
      data: {
        ...result.data,
      },
    })

    await createNotificationAction(
      `Successfully updated "${updateMembership.title}" membership.`,
      NotificationType.success,
      updateMembership.id,
      'Membership',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Membership Updated Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update membership. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update membership',
    }
  }
}

// delete
export async function deleteMembershipAction(membershipId: string): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // mutation
    const deleteMembership = await prisma.membership.delete({
      where: {
        id: membershipId,
      },
    })

    await createNotificationAction(
      `Successfully deleted "${deleteMembership.title}" membership.`,
      NotificationType.success,
      deleteMembership.id,
      'Membership',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Membership Deleted Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to delete membership. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to delete membership',
    }
  }
}
