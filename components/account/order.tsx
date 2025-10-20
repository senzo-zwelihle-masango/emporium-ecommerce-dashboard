'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  CheckCircleIcon,
  ClockIcon,
  DownloadIcon,
  EyeIcon,
  PackageIcon,
  RefreshCcwIcon,
  ShoppingBagIcon,
  TruckIcon,
  XCircleIcon,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { UserAccountData } from '@/types/user/account/data'

interface OrdersTabProps {
  orders: UserAccountData['orders']
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'processing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'shipped':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <ClockIcon className="h-4 w-4" />
    case 'processing':
      return <RefreshCcwIcon className="h-4 w-4" />
    case 'shipped':
      return <TruckIcon className="h-4 w-4" />
    case 'delivered':
      return <CheckCircleIcon className="h-4 w-4" />
    case 'cancelled':
      return <XCircleIcon className="h-4 w-4" />
    default:
      return <PackageIcon className="h-4 w-4" />
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount)
}

const OrderCard = ({ order }: { order: UserAccountData['orders'][0] }) => {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
            <CardDescription>
              Placed {formatDistanceToNow(order.createdAt, { addSuffix: true })}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(order.status)}>
              {getStatusIcon(order.status)}
              {order.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Order Items Preview */}
        <div className="space-y-3">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <Avatar className="h-12 w-12 rounded-md">
                <AvatarImage
                  src={item.product.images[0] || '/placeholder-product.jpg'}
                  alt={item.product.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-md">{item.product.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.product.name}</p>
                <p className="text-muted-foreground text-xs">
                  Qty: {item.quantity} × {formatCurrency(Number(item.price))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {formatCurrency(Number(item.price) * item.quantity)}
                </p>
              </div>
            </div>
          ))}

          {order.items.length > 3 && (
            <p className="text-muted-foreground py-2 text-center text-xs">
              +{order.items.length - 3} more item(s)
            </p>
          )}
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">{order.items.length} item(s)</p>
              {order.expectedDeliveryDate && (
                <p className="text-muted-foreground text-xs">
                  Expected: {order.expectedDeliveryDate.toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{formatCurrency(Number(order.totalAmount))}</p>
              {order.shippingCost && Number(order.shippingCost) > 0 && (
                <p className="text-muted-foreground text-xs">
                  +{formatCurrency(Number(order.shippingCost))} shipping
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <EyeIcon className="mr-2 h-4 w-4" />
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Invoice
          </Button>
          {order.status.toLowerCase() === 'delivered' && (
            <Button variant="outline" size="sm" className="flex-1">
              <RefreshCcwIcon className="mr-2 h-4 w-4" />
              Reorder
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export const OrdersTab = ({ orders }: OrdersTabProps) => {
  // Group orders by status for better organization
  const pendingOrders = orders.filter((order) =>
    ['pending', 'processing', 'shipped'].includes(order.status.toLowerCase())
  )
  const completedOrders = orders.filter((order) => order.status.toLowerCase() === 'delivered')
  const cancelledOrders = orders.filter((order) => order.status.toLowerCase() === 'cancelled')

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-16">
          <div>
            <PackageIcon />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold">No orders yet</h3>
            <p className="mx-auto max-w-sm">
              When you place orders, they&apos;ll appear here with tracking information and order
              history.
            </p>
          </div>
          <Button className="mt-4">
            <ShoppingBagIcon />
            Start Shopping
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ClockIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders.length}</div>
            <p className="text-muted-foreground text-xs">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircleIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders.length}</div>
            <p className="text-muted-foreground text-xs">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <PackageIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(orders.reduce((sum, order) => sum + Number(order.totalAmount), 0))}
            </div>
            <p className="text-muted-foreground text-xs">Across all orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders */}
      {pendingOrders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ClockIcon />
            <h3 className="text-lg font-semibold">Active Orders</h3>
            <Badge variant="secondary">{pendingOrders.length}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {pendingOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircleIcon />
          <h3 className="text-lg font-semibold">Order History</h3>
          <Badge variant="secondary">{completedOrders.length + cancelledOrders.length}</Badge>
        </div>

        {completedOrders.length > 0 || cancelledOrders.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...completedOrders, ...cancelledOrders]
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No completed orders yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
