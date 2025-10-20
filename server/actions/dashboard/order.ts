'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import {
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
  UpdateOrderStatusSchemaType,
  UpdatePaymentStatusSchemaType,
} from '@/schemas/dashboard/order'

export async function updateOrderStatusAction(
  orderId: string,
  values: UpdateOrderStatusSchemaType
): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const validation = updateOrderStatusSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: validation.data,
      include: {
        user: { select: { name: true, email: true } },
      },
    })

    await createNotificationAction(
      `Order #${updatedOrder.orderNumber} status updated to ${updatedOrder.status}`,
      NotificationType.information,
      updatedOrder.id,
      'Order',
      updatedOrder.userId
    )

    return {
      status: 'success',
      message: 'Order status updated successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update order status. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update order status',
    }
  }
}

export async function updatePaymentStatusAction(
  orderId: string,
  values: UpdatePaymentStatusSchemaType
): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const validation = updatePaymentStatusSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: validation.data,
      include: {
        user: { select: { name: true, email: true } },
      },
    })

    await createNotificationAction(
      `Order #${updatedOrder.orderNumber} payment status updated to ${updatedOrder.paymentStatus}`,
      NotificationType.information,
      updatedOrder.id,
      'Order',
      updatedOrder.userId
    )

    return {
      status: 'success',
      message: 'Payment status updated successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update payment status. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update payment status',
    }
  }
}

export async function deleteAdminOrderAction(orderId: string): Promise<void> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    await prisma.order.delete({
      where: { id: orderId },
    })

    await createNotificationAction(
      `Order deleted successfully`,
      NotificationType.information,
      undefined,
      undefined,
      session.user.id
    )
  } catch (error) {
    await createNotificationAction(
      `Failed to delete order. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    throw error
  }

  redirect('/admin/orders')
}
