import 'server-only'

import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'

export async function fetchAllBillboards() {
  noStore()
  const data = await prisma.billboard.findMany({
    select: {
      id: true,
      userId: true,
      label: true,
      description: true,
      image: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return data
}
