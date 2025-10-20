import 'server-only'

import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'

export async function fetchAllMemberships() {
  noStore()
  const data = await prisma.membership.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      benefits: true,
      popular: true,
      minPoints: true,
      maxPoints: true,
      crown: true,
      users: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return data
}
