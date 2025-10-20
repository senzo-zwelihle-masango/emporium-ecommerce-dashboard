import { z } from 'zod'
import { EventColor } from '@/lib/generated/prisma'

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(255, { message: 'Title is too long' }),
  description: z.string().optional().or(z.literal('')),
  start: z.coerce.date(),
  end: z.coerce.date(),
  allDay: z.boolean().default(false),
  color: z.enum(EventColor),
  location: z.string().optional().or(z.literal('')),
  contact: z.string().optional().or(z.literal('')),
})

export const updateEventSchema = eventSchema.extend({
  id: z.cuid(),
})

export type EventSchemaType = z.infer<typeof eventSchema>
export type UpdateEventSchemaType = z.infer<typeof updateEventSchema>
