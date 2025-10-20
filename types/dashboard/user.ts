import { Membership } from '@/lib/generated/prisma'

export type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  phoneNumber: string | null
  role: string
  membership: Membership | null
  banned: boolean | null
  banReason: string | null
  banExpires: string | null
  points: number
  _count: {
    sessions: number
    accounts: number
    orders: number
    reviews: number
    favorites: number
  }
  createdAt: string
  updatedAt: string
}
