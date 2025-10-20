import { z } from 'zod'

export const brandSchema = z.object({
  name: z.string().max(30, 'Brand name must be under 30 characters.'),
  logo: z.string().min(1, 'Brand logo is required, please upload atleast one image.'),
  active: z.boolean(),
})

export type BrandSchemaType = z.infer<typeof brandSchema>
