import { z } from 'zod'
import { DocumentStatus } from '@/lib/generated/prisma'

export const documentSchema = z.object({
  name: z.string().max(30, 'Document name must be under 30 characters.'),
  status: z.enum(DocumentStatus),
  file: z.string().min(1, 'Atleast one file required.'),
  starred: z.boolean(),
})

export type DocumentSchemaType = z.infer<typeof documentSchema>
