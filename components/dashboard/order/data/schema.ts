import { z } from 'zod'

// Define the order schema based on the Prisma model
export const orderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  userId: z.string().optional(),
  userName: z.string().nullable(),
  userEmail: z.string().nullable(),
  totalAmount: z.number(),
  status: z.enum([
    'pending',
    'confirmed',
    'processing',
    'packed',
    'shipped',
    'outfordelivery',
    'delivered',
    'cancelled',
    'returned',
  ]),
  paymentMethod: z.enum([
    'cashondelivery',
    'mastercard',
    'mobicred',
    'ozow',
    'payfast',
    'payflex',
    'paypal',
    'snapscan',
    'other',
  ]),
  paymentStatus: z.enum([
    'pending',
    'paid',
    'failed',
    'refunded',
    'partiallyrefunded',
    'authorized',
  ]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Order = z.infer<typeof orderSchema>
