import { z } from 'zod'
import { CollectionStatus } from '@/lib/generated/prisma'

export const collectionSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  label: z.string().max(30, 'Label must be under 30 characters.'),
  description: z.string().optional(),
  color: z.string().min(1, 'Color is required'),

  image: z.string().min(1, 'Collection image is required, please upload atleast one image.'),
  status: z.enum(CollectionStatus),
})

export type CollectionSchemaType = z.infer<typeof collectionSchema>
