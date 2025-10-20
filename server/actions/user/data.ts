'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import { prisma } from '@/lib/prisma/client'

import { UserAccountData } from '@/types/user/account/data'

export async function fetchUserAccountData() {
  // user session
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/signin')
  }

  //   fetch user account
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    // required fields
    include: {
      sessions: true,
      accounts: true,
      membership: true,
      membershipHistory: true,
      notifications: true,
      shipping: true,
      reviews: {
        include: {
          product: true,
        },
      },
      favorites: {
        include: {
          product: true,
        },
      },
      orders: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
          shipping: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      interactions: {
        include: {
          product: true,
        },
      },
      experience: true,
    },
  })

  return user as UserAccountData | null
}
