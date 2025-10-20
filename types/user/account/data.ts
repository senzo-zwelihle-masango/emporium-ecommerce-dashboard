import {
  User,
  Session,
  Account,
  Membership,
  MembershipHistory,
  Notification,
  Shipping,
  Review,
  Favorite,
  Product,
  ProductInteraction,
  Order,
  OrderItem,
  Experience,
} from '@/lib/generated/prisma'

export type UserAccountData = User & {
  sessions: Session[]
  accounts: Account[]

  membership: Membership | null
  membershipHistory: MembershipHistory[]

  notifications: Notification[]
  shipping: Shipping[]

  reviews: (Review & {
    product: Product
  })[]
  favorites: (Favorite & {
    product: Product
  })[]

  orders: (Order & {
    items: (OrderItem & {
      product: Product
    })[]
    shipping: Shipping
  })[]

  interactions: (ProductInteraction & {
    product: Product
  })[]

  experience: Experience[]
}
