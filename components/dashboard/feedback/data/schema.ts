import { z } from 'zod'

// Define the review schema
export const reviewSchema = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'flagged', 'archived']),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.string().nullable(),
  }),
  product: z.object({
    id: z.string(),
    name: z.string(),
    images: z.array(z.string()),
    brand: z.object({
      name: z.string(),
    }),
  }),
})

// Define the experience schema
export const experienceSchema = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.string().nullable(),
  }),
})

export type Review = z.infer<typeof reviewSchema>
export type Experience = z.infer<typeof experienceSchema>
