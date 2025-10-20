import { z } from 'zod'
import { NoteAction, NoteStatus, NoteTag } from '@/lib/generated/prisma'

export const noteSchema = z.object({
  title: z.string().max(30, 'Title must be under 30 characters.'),
  content: z.string().min(1, 'Note Content is required, please enter some content'),
  tag: z.enum(NoteTag),
  status: z.enum(NoteStatus),
  action: z.enum(NoteAction),
  published: z.boolean(),
})

export type NoteSchemaType = z.infer<typeof noteSchema>
