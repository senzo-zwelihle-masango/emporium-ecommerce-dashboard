import React from 'react'
import {
  PackageIcon,
  ShoppingCartIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ZarIcon from '@/components/icons/zar'

interface MetricCardProps {
  title: string
  value: string | number
  description: string
  trend: number
  icon: React.ReactNode
}

function MetricCard({ title, value, description, trend, icon }: MetricCardProps) {
  const isPositive = trend >= 0

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground h-4 w-4">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <div className="text-muted-foreground flex items-center pt-2 text-xs">
          {isPositive ? (
            <TrendingUpIcon className="mr-1 h-4 w-4" />
          ) : (
            <TrendingDownIcon className="mr-1 h-4 w-4" />
          )}
          <span className={isPositive ? '' : 'text-destructive'}>
            {Math.abs(trend).toFixed(1)}%
          </span>
          <span className="ml-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

interface DashboardStats {
  totalUsers: number
  totalOrders: number
  totalProducts: number
  totalRevenue: number
  userGrowth: number
  orderGrowth: number
  revenueGrowth: number
}

interface MetricCardsProps {
  stats: DashboardStats
}

export function MetricCards({ stats }: MetricCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Revenue"
        value={`R${stats.totalRevenue.toLocaleString()}`}
        description="from last month"
        trend={stats.revenueGrowth}
        icon={<ZarIcon />}
      />
      <MetricCard
        title="Total Orders"
        value={stats.totalOrders}
        description="from last month"
        trend={stats.orderGrowth}
        icon={<ShoppingCartIcon />}
      />
      <MetricCard
        title="Total Users"
        value={stats.totalUsers}
        description="from last month"
        trend={stats.userGrowth}
        icon={<UsersIcon />}
      />
      <MetricCard
        title="Total Products"
        value={stats.totalProducts}
        description="active products"
        trend={0}
        icon={<PackageIcon />}
      />
    </div>
  )
}
