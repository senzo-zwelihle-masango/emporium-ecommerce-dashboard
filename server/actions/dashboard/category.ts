'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { categorySchema, CategorySchemaType } from '@/schemas/dashboard/category'

// new
export async function createCategoryAction(values: CategorySchemaType): Promise<ApiResponse> {
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
    const validation = categorySchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const newCategory = await prisma.category.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    })

    // create notification
    await createNotificationAction(
      `Successfully created ${newCategory.name} category.`,
      NotificationType.success,
      newCategory.id,
      'Category',
      // Send notification to the user
      session.user.id
    )
    return {
      status: 'success',
      message: 'Category Created Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to create a new category. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to create category please try again.',
    }
  }
}

// update

export async function updateCategoryAction(
  data: CategorySchemaType,
  categoryId: string
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
    const result = categorySchema.safeParse(data)

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const updateCategory = await prisma.category.update({
      where: {
        id: categoryId,
        userId: session.user.id,
      },
      data: {
        ...result.data,
      },
    })

    await createNotificationAction(
      `Successfully updated "${updateCategory.name}" category.`,
      NotificationType.success,
      updateCategory.id,
      'Category',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Category Updated Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update category. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update category, please try again.',
    }
  }
}

// archive
export async function archiveCategoryAction(categoryId: string): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const archivedCategory = await prisma.category.update({
      where: {
        id: categoryId,
        userId: session.user.id,
      },
      data: {
        archived: true,
      },
    })

    await createNotificationAction(
      `Successfully archived "${archivedCategory.name}" category.`,
      NotificationType.success,
      archivedCategory.id,
      'Categpry',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Category Archived Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to archive category. Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to archive category',
    }
  }
}

// delete
export async function deleteCategoryAction(categoryId: string): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // mutation
    const deleteCategory = await prisma.category.delete({
      where: {
        id: categoryId,
        userId: session.user.id,
      },
    })

    await createNotificationAction(
      `Successfully deleted "${deleteCategory.name}" category.`,
      NotificationType.success,
      deleteCategory.id,
      'Category',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Category Deleted Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to delete category. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to delete category, please try again.',
    }
  }
}
