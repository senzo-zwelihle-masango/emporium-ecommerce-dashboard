import { z } from 'zod'
import { WarehouseStatus } from '@/lib/generated/prisma'

export const warehouseSchema = z.object({
  name: z.string().max(30, 'Warehouse must be under 30 characters.'),
  location: z.string().max(30, 'Warehouse location is required.'),
  description: z.string().min(1, 'Warehouse description is required.'),
  status: z.enum(WarehouseStatus),
})

export type WarehouseSchemaType = z.infer<typeof warehouseSchema>
