import 'server-only'

import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'

export async function fetchAllWarehouses() {
  noStore()
  const data = await prisma.warehouse.findMany({
    select: {
      id: true,
      user: {
        select: {
          name: true,
        },
      },
      name: true,
      location: true,
      description: true,
      status: true,
      products: { select: { id: true } },
      updatedAt: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return data
}
