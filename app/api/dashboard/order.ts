import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'
import { Order } from '@/components/dashboard/order/data/schema'

export async function fetchAllOrders(): Promise<Order[]> {
  noStore()

  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        status: true,
        paymentMethod: true,
        paymentStatus: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // transform data
    const transformedOrders: Order[] = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.user?.id || '',
      userName: order.user?.name || null,
      userEmail: order.user?.email || null,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }))

    return transformedOrders
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}
