import 'server-only'

import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'

export async function fetchAllPromotions() {
  noStore()
  const data = await prisma.promotion.findMany({
    select: {
      id: true,
      brandId: true,
      label: true,
      description: true,
      image: true,
      products: true,
      tags: true,

      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return data
}
