'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { brandSchema, BrandSchemaType } from '@/schemas/dashboard/brand'

// new
export async function createBrandAction(values: BrandSchemaType): Promise<ApiResponse> {
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
    const validation = brandSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const newBrand = await prisma.brand.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    })

    // create notification
    await createNotificationAction(
      `Successfully created ${newBrand.name} brand.`,
      NotificationType.success,
      newBrand.id,
      'Brand',
      // Send notification to the user
      session.user.id,
      newBrand.logo
    )
    return {
      status: 'success',
      message: 'Brand Created Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to create a new brand. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to create brand please try again.',
    }
  }
}

// update

export async function updateBrandAction(
  data: BrandSchemaType,
  brandId: string
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
    const result = brandSchema.safeParse(data)

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const updateBrand = await prisma.brand.update({
      where: {
        id: brandId,
        userId: session.user.id,
      },
      data: {
        ...result.data,
      },
    })

    await createNotificationAction(
      `Successfully updated "${updateBrand.name}" brand.`,
      NotificationType.success,
      updateBrand.id,
      'Brand',
      session.user.id,
      updateBrand.logo
    )
    return {
      status: 'success',
      message: 'Brand Updated Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update brand. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update brand, please try again.',
    }
  }
}

// archive
export async function archiveBrandAction(brandId: string): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const archivedBrand = await prisma.brand.update({
      where: {
        id: brandId,
        userId: session.user.id,
      },
      data: {
        archived: true,
      },
    })

    await createNotificationAction(
      `Successfully archived "${archivedBrand.name}" brand.`,
      NotificationType.success,
      archivedBrand.id,
      'Brand',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Brand Archived Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to archive brand. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to archive brand',
    }
  }
}

// delete
export async function deleteBrandAction(brandId: string): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // mutation
    const deleteBrand = await prisma.brand.delete({
      where: {
        id: brandId,
        userId: session.user.id,
      },
    })

    await createNotificationAction(
      `Successfully deleted "${deleteBrand.name}" brand.`,
      NotificationType.success,
      deleteBrand.id,
      'Brand',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Brand Deleted Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to delete brand. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to delete brand, please try again.',
    }
  }
}
