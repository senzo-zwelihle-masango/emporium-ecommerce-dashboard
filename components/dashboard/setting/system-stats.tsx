'use client'

import React from 'react'
import { UsersIcon, ShoppingCartIcon, PackageIcon, DatabaseIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SystemStatsProps {
  userCount: number
  orderCount: number
  productCount: number
}

export const SystemStats = ({ userCount, orderCount, productCount }: SystemStatsProps) => {
  const stats = [
    {
      title: 'Total Users',
      value: userCount,
      icon: UsersIcon,
      description: 'Active user accounts',
    },
    {
      title: 'Total Orders',
      value: orderCount,
      icon: ShoppingCartIcon,
      description: 'Processed orders',
    },
    {
      title: 'Total Products',
      value: productCount,
      icon: PackageIcon,
      description: 'Available products',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DatabaseIcon className="h-5 w-5" />
          System Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Icon className="text-primary h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className="text-muted-foreground text-xs">{stat.description}</p>
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
