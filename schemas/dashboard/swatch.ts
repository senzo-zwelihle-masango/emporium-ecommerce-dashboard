import { z } from 'zod'
import { ProductSwatchType, ProductStatus } from '@/lib/generated/prisma'

export const swatchSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  type: z.enum(ProductSwatchType),
  name: z.string().min(1, 'Name is required').max(50),
  value: z.string().min(1, 'Value is required').max(100),
  images: z.array(z.url('Invalid image URL')).min(1, 'At least one image is required'),
  status: z.enum(ProductStatus),
})

export type SwatchSchemaType = z.infer<typeof swatchSchema>
