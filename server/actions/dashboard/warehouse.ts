'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { warehouseSchema, WarehouseSchemaType } from '@/schemas/dashboard/warehouse'

// new

export async function createNewWarehouseAction(values: WarehouseSchemaType): Promise<ApiResponse> {
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
    const validation = warehouseSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const newWarehouse = await prisma.warehouse.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    })

    // create notification
    await createNotificationAction(
      `Successfully created ${newWarehouse.name} warehouse.`,
      NotificationType.success,
      newWarehouse.id,
      'Warehouse',
      // Send notification to the user
      session.user.id
    )
    return {
      status: 'success',
      message: 'Warehouse Created Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to add a new warehouse. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to create warehouse',
    }
  }
}

// update

export async function updateWarehouseAction(
  data: WarehouseSchemaType,
  warehouseId: string
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
    const result = warehouseSchema.safeParse(data)

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const updateWarehouse = await prisma.warehouse.update({
      where: {
        id: warehouseId,
        userId: session.user.id,
      },
      data: {
        ...result.data,
      },
    })

    await createNotificationAction(
      `Successfully updated "${updateWarehouse.name}" warehouse.`,
      NotificationType.success,
      updateWarehouse.id,
      'Warehouse',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Warehouse Updated Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update warehouse. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update warehouse',
    }
  }
}

// archive
export async function archiveWarehouseAction(warehouseId: string): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const archivedWarehouse = await prisma.warehouse.update({
      where: {
        id: warehouseId,
      },
      data: {
        archived: true,
      },
    })

    await createNotificationAction(
      `Successfully archived "${archivedWarehouse.name}" warehouse.`,
      NotificationType.success,
      archivedWarehouse.id,
      'Warehouse',
      session.user.id
    )

    return {
      status: 'success',
      message: 'Warehouse Archived Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to archive warehouse. Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to archive warehouse',
    }
  }
}

// delete
export async function deleteWarehouseAction(warehouseId: string): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // mutation
    const deleteWarehouse = await prisma.warehouse.delete({
      where: {
        id: warehouseId,
        userId: session.user.id,
      },
    })

    await createNotificationAction(
      `Successfully deleted "${deleteWarehouse.name}" warehouse.`,
      NotificationType.success,
      deleteWarehouse.id,
      'Warehouse',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Warehouse Deleted Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to delete warehouse. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to delete warehouse',
    }
  }
}
