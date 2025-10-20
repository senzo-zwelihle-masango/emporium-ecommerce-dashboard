'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import {
  eventSchema,
  EventSchemaType,
  updateEventSchema,
  UpdateEventSchemaType,
} from '@/schemas/dashboard/event'

// Create a new event
export async function createEventAction(values: EventSchemaType): Promise<ApiResponse> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      status: 'error',
      message: 'Authentication required. Please sign in',
    }
  }

  try {
    const validation = eventSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    await prisma.event.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    })

    await createNotificationAction(
      `Event "${validation.data.title}" created successfully.`,
      NotificationType.success,
      undefined,
      'Event',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Event created successfully.',
    }
  } catch (error) {
    console.error('Failed to create event:', error)
    await createNotificationAction(
      `Failed to create event. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      'Event',
      session.user.id
    )

    return {
      status: 'error',
      message: 'Failed to create event.',
    }
  }
}

// Update an existing event
export async function updateEventAction(values: UpdateEventSchemaType): Promise<ApiResponse> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      status: 'error',
      message: 'Authentication required. Please sign in',
    }
  }

  try {
    const validation = updateEventSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    const { id, ...data } = validation.data

    // Verifications mutation to see wether the user owns the event
    const existingEvent = await prisma.event.findUnique({
      where: { id: id },
    })

    if (!existingEvent || existingEvent.userId !== session.user.id) {
      return {
        status: 'error',
        message: 'You are not authorized to edit this event.',
      }
    }

    await prisma.event.update({
      where: { id: id },
      data: data,
    })

    await createNotificationAction(
      `Event "${data.title}" updated successfully.`,
      NotificationType.success,
      undefined,
      'Event',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Event updated successfully.',
    }
  } catch (error) {
    console.error('Failed to update event:', error)
    await createNotificationAction(
      `Failed to update event. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      'Event',
      session.user.id
    )

    return {
      status: 'error',
      message: 'Failed to update event.',
    }
  }
}

// delete
export async function deleteEventAction(id: string): Promise<ApiResponse> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      status: 'error',
      message: 'Authentication required. Please sign in',
    }
  }

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: id },
    })

    if (!existingEvent || existingEvent.userId !== session.user.id) {
      return {
        status: 'error',
        message: 'You are not authorized to delete this event.',
      }
    }

    await prisma.event.delete({
      where: { id: id },
    })

    await createNotificationAction(
      `Event "${existingEvent.title}" deleted successfully.`,
      NotificationType.success,
      undefined,
      'Event',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Event deleted successfully.',
    }
  } catch (error) {
    console.error('Failed to delete event:', error)
    await createNotificationAction(
      `Failed to delete event. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      'Event',
      session.user.id
    )

    return {
      status: 'error',
      message: 'Failed to delete event.',
    }
  }
}
