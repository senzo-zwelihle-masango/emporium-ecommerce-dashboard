import 'server-only'

import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'

export async function fetchAllNotes() {
  noStore()
  const data = await prisma.note.findMany({
    select: {
      id: true,
      user: {
        select: { name: true },
      },
      title: true,
      content: true,
      tag: true,
      status: true,
      action: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return data
}
