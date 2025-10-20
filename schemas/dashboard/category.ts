import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().max(30, 'Category must be under 30 characters.'),
  active: z.boolean(),
})

export type CategorySchemaType = z.infer<typeof categorySchema>
