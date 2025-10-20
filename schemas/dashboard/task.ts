import { z } from 'zod'
import { TaskPriority, TaskStatus } from '@/lib/generated/prisma'

export const taskSchema = z.object({
  title: z.string().max(30, 'Title must be under 30 characters.'),
  status: z.enum(TaskStatus),
  label: z.string().min(1, 'Task label is required, please enter some a valid label.'),
  priority: z.enum(TaskPriority),
})

export type TaskSchemaType = z.infer<typeof taskSchema>
