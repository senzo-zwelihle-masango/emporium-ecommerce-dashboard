import 'server-only'

import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'
import { CollectionRow } from '@/components/dashboard/collection/columns'

export async function fetchAllCollections(): Promise<CollectionRow[]> {
  noStore()
  const data = await prisma.collection.findMany({
    select: {
      id: true,
      label: true,
      description: true,
      color: true,
      image: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: { name: true },
      },
      user: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return data
}
