import { z } from 'zod'
import { Role } from '@/lib/generated/prisma'

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required, please enter a valid name'),
  email: z.email('Invalid email address'),
  role: z.enum(Role),
  phoneNumber: z.string().optional(),
  image: z.string().optional(),
})

export const editUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  role: z.enum(Role),
  phoneNumber: z.string().nullable(),
  image: z.string(),
})

export type CreateUserSchemaType = z.infer<typeof createUserSchema>
export type EditUserSchemaType = z.infer<typeof editUserSchema>
