'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'
import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { promotionSchema, PromotionSchemaType } from '@/schemas/dashboard/promotion'

// create
export async function createPromotionAction(values: PromotionSchemaType): Promise<ApiResponse> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) redirect('/sign-in')

  try {
    const validation = promotionSchema.safeParse(values)
    if (!validation.success) {
      return { status: 'error', message: 'Invalid form data' }
    }

    const { brandId, label, description, image, active, productIds, tags } = validation.data

    const promotion = await prisma.promotion.create({
      data: {
        brandId,
        label,
        description,
        image,
        active,
        products: {
          connect: productIds.map((id) => ({ id })),
        },
        tags: {
          connectOrCreate: tags.map((tag) => {
            const isId = tag.length === 25 // cuid length
            if (isId) {
              return {
                where: { id: tag },
                create: { label: tag, description: tag },
              }
            }
            return {
              where: { label: tag },
              create: { label: tag, description: tag },
            }
          }),
        },
        userId: session.user.id,
      },
    })

    await createNotificationAction(
      `Successfully created promotion "${promotion.label}"`,
      NotificationType.success,
      promotion.id,
      'Promotion',
      session.user.id
    )

    return { status: 'success', message: 'Promotion created successfully' }
  } catch (error) {
    await createNotificationAction(
      `Failed to create promotion. Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return { status: 'error', message: 'Failed to create promotion' }
  }
}

// update
export async function updatePromotionAction(
  promotionId: string,
  values: PromotionSchemaType
): Promise<ApiResponse> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) redirect('/sign-in')

  try {
    const validation = promotionSchema.safeParse(values)
    if (!validation.success) {
      return { status: 'error', message: 'Invalid form data' }
    }

    const { brandId, label, description, image, active, productIds, tags } = validation.data

    const promotion = await prisma.promotion.update({
      where: { id: promotionId },
      data: {
        brandId,
        label,
        description,
        image,
        active,
        products: {
          set: [],
          connect: productIds.map((id) => ({ id })),
        },
        tags: {
          set: [],
          connectOrCreate: tags.map((tag) => {
            const isId = tag.length === 25
            if (isId) {
              return {
                where: { id: tag },
                create: { label: tag, description: tag },
              }
            }
            return {
              where: { label: tag },
              create: { label: tag, description: tag },
            }
          }),
        },
      },
    })

    await createNotificationAction(
      `Successfully updated promotion "${promotion.label}"`,
      NotificationType.success,
      promotion.id,
      'Promotion',
      session.user.id
    )

    return { status: 'success', message: 'Promotion updated successfully' }
  } catch (error) {
    await createNotificationAction(
      `Failed to update promotion. Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return { status: 'error', message: 'Failed to update promotion' }
  }
}

// delete
export async function deletePromotionAction(promotionId: string): Promise<ApiResponse> {
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
    const deletePromotion = await prisma.promotion.delete({
      where: {
        id: promotionId,
      },
    })

    await createNotificationAction(
      `Successfully deleted "${deletePromotion.label}" promotion.`,
      NotificationType.success,
      deletePromotion.id,
      'Promotion',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Promotion Deleted Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to delete promotion. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to delete promotion',
    }
  }
}
