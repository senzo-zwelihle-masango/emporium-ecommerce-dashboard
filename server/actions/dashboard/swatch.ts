'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { swatchSchema, SwatchSchemaType } from '@/schemas/dashboard/swatch'

// create
export async function createSwatchAction(values: SwatchSchemaType): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const validation = swatchSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    const newSwatch = await prisma.productSwatch.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    })

    await createNotificationAction(
      `Successfully created ${newSwatch.name} swatch.`,
      NotificationType.success,
      newSwatch.id,
      'Swatch',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Swatch Created Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to create swatch. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to create swatch please try again.',
    }
  }
}

// update
export async function updateSwatchAction(
  data: SwatchSchemaType,
  swatchId: string
): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const result = swatchSchema.safeParse(data)

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    const updateSwatch = await prisma.productSwatch.update({
      where: {
        id: swatchId,
      },
      data: result.data,
    })

    await createNotificationAction(
      `Successfully updated "${updateSwatch.name}" swatch.`,
      NotificationType.success,
      updateSwatch.id,
      'Swatch',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Swatch Updated Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update swatch. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update swatch, please try again.',
    }
  }
}

// archive
export async function archiveSwatchAction(swatchId: string): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const archivedProductSwatch = await prisma.productSwatch.update({
      where: {
        id: swatchId,
      },
      data: {
        archived: true, // or deletedAt: new Date(),
      },
    })

    await createNotificationAction(
      `Successfully archived "${archivedProductSwatch.name}" swatch.`,
      NotificationType.success,
      archivedProductSwatch.id,
      'Swatch',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Swatch Archived Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to archive swatch. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to archive product swatch',
    }
  }
}

// delete
export async function deleteSwatchAction(swatchId: string): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const deleteSwatch = await prisma.productSwatch.delete({
      where: {
        id: swatchId,
      },
    })

    await createNotificationAction(
      `Successfully deleted "${deleteSwatch.name}" swatch.`,
      NotificationType.success,
      deleteSwatch.id,
      'Swatch',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Swatch Deleted Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to delete swatch. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to delete swatch, please try again.',
    }
  }
}
