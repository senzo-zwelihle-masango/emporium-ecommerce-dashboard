import { z } from 'zod'
import { OrderStatus, PaymentStatus } from '@/lib/generated/prisma'

export const getAdminOrdersSchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  perPage: z.coerce.number().min(1).max(100).default(10).optional(),
  status: z.enum(OrderStatus).optional(),
  paymentStatus: z.enum(PaymentStatus).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'totalAmount']).default('createdAt').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(OrderStatus),
  transactionId: z.string().optional().nullable(),
  paymentGatewayId: z.string().optional().nullable(),
  cancellationReason: z.string().optional().nullable(),
  actualDeliveryDate: z.date().optional().nullable(),
  expectedDeliveryDate: z.date().optional().nullable(),
})

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(PaymentStatus),
  transactionId: z.string().optional().nullable(),
  paymentGatewayId: z.string().optional().nullable(),
})

export type GetAdminOrdersSchemaType = z.infer<typeof getAdminOrdersSchema>
export type UpdateOrderStatusSchemaType = z.infer<typeof updateOrderStatusSchema>
export type UpdatePaymentStatusSchemaType = z.infer<typeof updatePaymentStatusSchema>
