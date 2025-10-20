'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { productSchema, ProductSchemaType } from '@/schemas/dashboard/product'

// new
export async function createProductAction(values: ProductSchemaType): Promise<ApiResponse> {
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
    const validation = productSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const newProduct = await prisma.product.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    })

    // create notification
    await createNotificationAction(
      `Successfully created ${newProduct.name} product.`,
      NotificationType.success,
      newProduct.id,
      'Product',
      // Send notification to the user
      session.user.id
    )
    return {
      status: 'success',
      message: 'Product Created Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to create a new product. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to create product please try again.',
    }
  }
}

// update

export async function updateProductAction(
  data: ProductSchemaType,
  productId: string
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
    const result = productSchema.safeParse(data)

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const updateProduct = await prisma.product.update({
      where: {
        id: productId,
        userId: session.user.id,
      },
      data: {
        ...result.data,
      },
    })

    await createNotificationAction(
      `Successfully updated "${updateProduct.name}" product.`,
      NotificationType.success,
      updateProduct.id,
      'Product',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Product Updated Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update product. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update product, please try again.',
    }
  }
}

// archive
export async function archiveProductAction(productId: string): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const archivedProduct = await prisma.product.update({
      where: {
        id: productId,
        userId: session.user.id,
      },
      data: {
        archived: true,
      },
    })

    await createNotificationAction(
      `Successfully archived "${archivedProduct.name}" product.`,
      NotificationType.success,
      archivedProduct.id,
      'Product',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Product Archived Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to archive product. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to archive product',
    }
  }
}

// delete
export async function deleteProductAction(productId: string): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // mutation
    const deleteProduct = await prisma.product.delete({
      where: {
        id: productId,
        userId: session.user.id,
      },
    })

    await createNotificationAction(
      `Successfully deleted "${deleteProduct.name}" product.`,
      NotificationType.success,
      deleteProduct.id,
      'Product',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Product Deleted Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to delete product. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to delete product, please try again.',
    }
  }
}
