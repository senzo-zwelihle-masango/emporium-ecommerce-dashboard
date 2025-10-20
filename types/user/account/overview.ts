export interface AccountStats {
  totalOrders: number
  totalSpent: number
  totalReviews: number
  totalFavorites: number
  membershipLevel: string | null
  joinedDate: Date
  lastLoginDate: Date | null
}

export interface RecentActivity {
  type: 'order' | 'review' | 'favorite'
  id: string
  title: string
  description: string
  date: Date
  status?: string
  amount?: number
}

export interface AccountOverviewData {
  stats: AccountStats
  recentActivities: RecentActivity[]
  upcomingDeliveries: {
    id: string
    orderNumber: string
    estimatedDate: Date
    status: string
    items: number
  }[]
  recommendedProducts: {
    id: string
    name: string
    image: string
    price: number
    originalPrice?: number
    rating: number
  }[]
}

export interface TabConfig {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
  href?: string
}
