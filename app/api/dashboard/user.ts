import 'server-only'

import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'

function sanitizeUser<
  T extends {
    createdAt: Date
    updatedAt: Date
    banExpires?: Date | null
  },
>(user: T) {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    banExpires: user.banExpires?.toISOString() ?? null,
  }
}

export async function fetchAllUsers() {
  noStore()
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      phoneNumber: true,
      role: true,
      membershipId: true,
      banned: true,
      banReason: true,
      banExpires: true,
      points: true,
      createdAt: true,
      updatedAt: true,
      membership: true,
      _count: {
        select: {
          sessions: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return users.map(sanitizeUser)
}
