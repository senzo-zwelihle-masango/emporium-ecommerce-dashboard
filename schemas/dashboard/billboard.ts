import { z } from 'zod'
import { BillboardStatus } from '@/lib/generated/prisma'

export const billboardSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  label: z.string().max(200, 'Label must be under 30 characters.'),
  description: z.string().max(500, 'Label must be under 30 characters.'),
  image: z.string().min(1, 'Collection image is required, please upload atleast one image.'),
  status: z.enum(BillboardStatus),
  featuredProductId: z.string().nullable().optional(),
})

export type BillboardSchemaType = z.infer<typeof billboardSchema>
