import { z } from 'zod'

export const membershipSchema = z.object({
  title: z.string().max(30, 'Membership name must be under 30 characters.'),
  description: z.string().min(1, 'Description is required.'),
  benefits: z.array(z.string()),
  popular: z.boolean(),
  minPoints: z.number().min(0, 'Minimum Points must be greater than 0'),
  maxPoints: z.number().min(0, 'Maximum Points must be greater than 0'),
  crown: z.string().min(1, 'Membership logo is required, please upload at least one image.'),
})

export type MembershipSchemaType = z.infer<typeof membershipSchema>
