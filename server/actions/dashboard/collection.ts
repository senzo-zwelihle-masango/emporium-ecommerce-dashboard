'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { collectionSchema, CollectionSchemaType } from '@/schemas/dashboard/collection'

// new

export async function createCollectionAction(values: CollectionSchemaType): Promise<ApiResponse> {
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
    const validation = collectionSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const newCollection = await prisma.collection.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    })

    // create notification
    await createNotificationAction(
      `Successfully created ${newCollection.label} collection.`,
      NotificationType.success,
      newCollection.id,
      'Collection',
      // Send notification to the user
      session.user.id
    )
    return {
      status: 'success',
      message: 'Collection Created Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to add a new collection. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to create collection',
    }
  }
}

// update

export async function updateCollectionAction(
  data: CollectionSchemaType,
  collectionId: string
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
    const result = collectionSchema.safeParse(data)

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const updateCollection = await prisma.collection.update({
      where: {
        id: collectionId,
        userId: session.user.id,
      },
      data: {
        ...result.data,
      },
    })

    await createNotificationAction(
      `Successfully updated "${updateCollection.label}" collection.`,
      NotificationType.success,
      updateCollection.id,
      'Collections',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Collection Updated Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update collection. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update collection',
    }
  }
}

// archive
export async function archiveCollectionAction(collectionId: string): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const archivedCollection = await prisma.collection.update({
      where: {
        id: collectionId,
        userId: session.user.id,
      },
      data: {
        archived: true,
      },
    })

    await createNotificationAction(
      `Successfully archived "${archivedCollection.label}" collection.`,
      NotificationType.success,
      archivedCollection.id,
      'Collection',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Collection Archived Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to archive collection. Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to archive collection',
    }
  }
}

// delete
export async function deleteCollectionAction(collectionId: string): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // mutation
    const deleteCollection = await prisma.collection.delete({
      where: {
        id: collectionId,
        userId: session.user.id,
      },
    })

    await createNotificationAction(
      `Successfully deleted "${deleteCollection.label}" collection.`,
      NotificationType.success,
      deleteCollection.id,
      'Collection',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Collection Deleted Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to delete collection. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to delete collection',
    }
  }
}
