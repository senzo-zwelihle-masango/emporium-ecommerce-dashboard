import { z } from 'zod'

// We're keeping a simple non-relational schema here.
export const ticketSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.string(),
  priority: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.object({
    name: z.string(),
    email: z.string(),
  }),
})

export type Ticket = z.infer<typeof ticketSchema>
