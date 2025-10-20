import 'server-only'

import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'

export async function fetchAllCategories() {
  noStore()
  const data = await prisma.category.findMany({
    select: {
      id: true,
      _count: true,
      user: { select: { email: true } },
      name: true,
      products: { select: { id: true } },
      collections: { select: { id: true } },
      billboards: { select: { id: true } },
      active: true,
      updatedAt: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return data
}
