import React from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  amount: number
  status: string
  date: Date
}

interface RecentOrdersProps {
  orders: Order[]
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  packed: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-orange-100 text-orange-800',
  outfordelivery: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800',
}

const RecentOrdersCard = ({ orders }: RecentOrdersProps) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest 10 orders from your store</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {order.customerName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{order.customerName}</p>
                  <p className="text-muted-foreground text-xs">#{order.orderNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge
                  className={`${statusColors[order.status as keyof typeof statusColors]} border-0`}
                >
                  {order.status.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </Badge>
                <div className="text-right">
                  <p className="text-sm font-medium">R{order.amount.toLocaleString()}</p>
                  <p className="text-muted-foreground text-xs">
                    {format(new Date(order.date), 'MMM dd')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentOrdersCard
