import { NotificationType } from '@/lib/generated/prisma'

export interface Notification {
  id: string
  userId: string
  message: string
  image?: string | null
  images?: string[]
  type: NotificationType
  relatedEntityId?: string | null
  relatedEntityType?: string | null
  read: boolean
  createdAt: Date
  updatedAt: Date
}

export interface NotificationWithUser extends Notification {
  user: {
    id: string
    name: string | null
    email: string | null
  }
}
