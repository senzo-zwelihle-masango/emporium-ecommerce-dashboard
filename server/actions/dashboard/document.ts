'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { documentSchema, DocumentSchemaType } from '@/schemas/dashboard/document'

// new
export async function createDocumentAction(values: DocumentSchemaType): Promise<ApiResponse> {
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
    const validation = documentSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const newDocument = await prisma.document.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    })

    // create notification
    await createNotificationAction(
      `Successfully uploaded ${newDocument.name} document.`,
      NotificationType.success,
      newDocument.id,
      'Document',
      // Send notification to the user
      session.user.id
    )
    return {
      status: 'success',
      message: 'Document Uploaded Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to upload a new document. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to upload document please try again.',
    }
  }
}

// update

export async function updateDocumentAction(
  data: DocumentSchemaType,
  documentId: string
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
    const result = documentSchema.safeParse(data)

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const updateDocument = await prisma.document.update({
      where: {
        id: documentId,
        userId: session.user.id,
      },
      data: {
        ...result.data,
      },
    })

    await createNotificationAction(
      `Successfully updated "${updateDocument.name}" document.`,
      NotificationType.success,
      updateDocument.id,
      'Document',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Document Updated Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update document. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update document, please try again.',
    }
  }
}

// archive
export async function archiveDocumentAction(documentId: string): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const archivedDocument = await prisma.document.update({
      where: {
        id: documentId,
        userId: session.user.id,
      },
      data: {
        archived: true,
      },
    })

    await createNotificationAction(
      `Successfully archived "${archivedDocument.name}" document.`,
      NotificationType.success,
      archivedDocument.id,
      'Document',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Document Archived Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to archive document. Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to archive document',
    }
  }
}

// delete
export async function deleteDocumentAction(documentId: string): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // mutation
    const deleteDocument = await prisma.document.delete({
      where: {
        id: documentId,
        userId: session.user.id,
      },
    })

    await createNotificationAction(
      `Successfully deleted "${deleteDocument.name}" document.`,
      NotificationType.success,
      deleteDocument.id,
      'Document',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Document Deleted Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to delete document. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to delete document, please try again.',
    }
  }
}
