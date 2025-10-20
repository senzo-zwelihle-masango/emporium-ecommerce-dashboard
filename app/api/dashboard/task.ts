import 'server-only'

import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'

export async function fetchAllTasks() {
  noStore()
  const data = await prisma.task.findMany({
    select: {
      id: true,
      title: true,
      label: true,
      status: true,
      priority: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return data
}
