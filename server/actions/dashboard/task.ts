'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { taskSchema, TaskSchemaType } from '@/schemas/dashboard/task'

// new
export async function createTaskAction(values: TaskSchemaType): Promise<ApiResponse> {
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
    const validation = taskSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const newTask = await prisma.task.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    })

    // create notification
    await createNotificationAction(
      `Successfully created ${newTask.title} task.`,
      NotificationType.success,
      newTask.id,
      'Task',
      // Send notification to the user
      session.user.id
    )
    return {
      status: 'success',
      message: 'Task Created Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to create a new task. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to create task please try again.',
    }
  }
}

// update

export async function updateTaskAction(data: TaskSchemaType, taskId: string): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // schema validation
    const result = taskSchema.safeParse(data)

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const updateTask = await prisma.task.update({
      where: {
        id: taskId,
        userId: session.user.id,
      },
      data: {
        ...result.data,
      },
    })

    await createNotificationAction(
      `Successfully updated "${updateTask.title}" task.`,
      NotificationType.success,
      updateTask.id,
      'Task',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Task Updated Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update task. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update task, please try again.',
    }
  }
}

export async function archiveTaskAction(taskId: string): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const archivedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        archived: true,
      },
    })

    await createNotificationAction(
      `Successfully archived "${archivedTask.title}" task.`,
      NotificationType.success,
      archivedTask.id,
      'Task',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Task Archived Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to archive task. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to archive task',
    }
  }
}

// delete
export async function deleteTaskAction(taskId: string): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // mutation
    const deleteTask = await prisma.task.delete({
      where: {
        id: taskId,
        userId: session.user.id,
      },
    })

    await createNotificationAction(
      `Successfully deleted "${deleteTask.title}" task.`,
      NotificationType.success,
      deleteTask.id,
      'Task',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Task Deleted Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to delete task. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to delete task, please try again.',
    }
  }
}
