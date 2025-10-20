import 'server-only'

import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'

export async function fetchAllBrands() {
  noStore()
  const data = await prisma.brand.findMany({
    select: {
      id: true,
      _count: true,
      name: true,
      logo: true,
      active: true,
      products: { select: { id: true } },
      promotions: { select: { id: true } },
      updatedAt: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return data
}
