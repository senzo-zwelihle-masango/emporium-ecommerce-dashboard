import { z } from 'zod'

export const promotionSchema = z.object({
  brandId: z.string().min(1, 'Brand is required'),
  label: z.string().min(1, 'Promotion label is required'),
  description: z.string().min(1, 'Promotion description is required'),
  image: z.string().min(1, 'Promotion image is required'),
  active: z.boolean(),
  productIds: z.array(z.string().min(1)),
  tags: z.array(z.string().min(1)),
})

export const promotionTagSchema = z.object({
  label: z.string().min(1, 'Tag label is required'),
  description: z.string().min(1, 'Tag description is required'),
})

export type PromotionSchemaType = z.infer<typeof promotionSchema>
export type PromotionTagSchemaType = z.infer<typeof promotionTagSchema>
