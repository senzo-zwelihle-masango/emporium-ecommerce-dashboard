'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { noteSchema, NoteSchemaType } from '@/schemas/dashboard/note'

// new
export async function createNoteAction(values: NoteSchemaType): Promise<ApiResponse> {
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
    const validation = noteSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data please ensure all fields are filled in',
      }
    }

    // mutation
    const newNote = await prisma.note.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    })

    // create notification
    await createNotificationAction(
      `Successfully create ${newNote.title} note.`,
      NotificationType.success,
      newNote.id,
      'Note',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Note Created Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to create a new note. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to create note please try again.',
    }
  }
}

// update

export async function updateNoteAction(data: NoteSchemaType, noteId: string): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // schema validation
    const result = noteSchema.safeParse(data)

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const updateNote = await prisma.note.update({
      where: {
        id: noteId,
        userId: session.user.id,
      },
      data: {
        ...result.data,
      },
    })

    await createNotificationAction(
      `Successfully updated "${updateNote.title}" note.`,
      NotificationType.success,
      updateNote.id,
      'Note',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Note Updated Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update note. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update note, please try again.',
    }
  }
}

// archive
export async function archiveNoteAction(noteId: string): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const archivedNote = await prisma.note.update({
      where: {
        id: noteId,
        userId: session.user.id,
      },
      data: {
        archived: true,
      },
    })

    await createNotificationAction(
      `Successfully archived "${archivedNote.title}" note.`,
      NotificationType.success,
      archivedNote.id,
      'Note',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Note Archived Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to archive note. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to archive note',
    }
  }
}

// delete
export async function deleteNoteAction(noteId: string): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // mutation
    const deleteNote = await prisma.note.delete({
      where: {
        id: noteId,
        userId: session.user.id,
      },
    })

    await createNotificationAction(
      `Successfully deleted "${deleteNote.title}" note.`,
      NotificationType.success,
      deleteNote.id,
      'Note',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Note Deleted Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to delete note. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to delete note, please try again.',
    }
  }
}
