'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { billboardSchema, BillboardSchemaType } from '@/schemas/dashboard/billboard'

// new

export async function createBillboardAction(values: BillboardSchemaType): Promise<ApiResponse> {
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
    const validation = billboardSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const newBillboard = await prisma.billboard.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    })

    // create notification
    await createNotificationAction(
      `Successfully created ${newBillboard.label} billboard.`,
      NotificationType.success,
      newBillboard.id,
      'Billboard',

      session.user.id
    )
    return {
      status: 'success',
      message: 'Billboard Created Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to add a new billboard. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to create billboard',
    }
  }
}

// update

export async function updateBillboardAction(
  data: BillboardSchemaType,
  billboardId: string
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
    const result = billboardSchema.safeParse(data)

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const updateBillboard = await prisma.billboard.update({
      where: {
        id: billboardId,
        userId: session.user.id,
      },
      data: {
        ...result.data,
      },
    })

    await createNotificationAction(
      `Successfully updated "${updateBillboard.label}" billboard.`,
      NotificationType.success,
      updateBillboard.id,
      'Billboard',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Billboard Updated Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update billboard. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update billboard',
    }
  }
}

// archive
export async function archiveBillboardAction(billboardId: string): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const archivedBillboard = await prisma.billboard.update({
      where: {
        id: billboardId,
        userId: session.user.id,
      },
      data: {
        archived: true,
      },
    })

    await createNotificationAction(
      `Successfully archived "${archivedBillboard.label}" billboard.`,
      NotificationType.success,
      archivedBillboard.id,
      'Billboard',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Billboard Archived Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to archive billboard. Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to archive billboard',
    }
  }
}

// delete
export async function deleteBillboardAction(billboardId: string): Promise<ApiResponse> {
  // user session
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // mutation
    const deleteBillboard = await prisma.billboard.delete({
      where: {
        id: billboardId,
        userId: session.user.id,
      },
    })

    await createNotificationAction(
      `Successfully deleted "${deleteBillboard.label}" billboard.`,
      NotificationType.success,
      deleteBillboard.id,
      'Billboard',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Billboard Deleted Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to delete billboard. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to delete billboard',
    }
  }
}
