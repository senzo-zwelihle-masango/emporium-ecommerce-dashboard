'use client'

import React from 'react'
import { DownloadIcon, EyeIcon, FilterIcon, SearchIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  status: string
  paymentStatus: string
  paymentMethod: string
  createdAt: Date
  itemCount: number
  user: {
    name: string
    email: string
  }
}

interface OrdersTableProps {
  orders: Order[]
  total: number
  totalPages: number
  currentPage: number
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  packed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  shipped: 'bg-orange-100 text-orange-800 border-orange-200',
  outfordelivery: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  returned: 'bg-gray-100 text-gray-800 border-gray-200',
}

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-blue-100 text-blue-800',
  partiallyrefunded: 'bg-orange-100 text-orange-800',
  authorized: 'bg-purple-100 text-purple-800',
}

const OrdersTable = ({ orders, total, totalPages, currentPage }: OrdersTableProps) => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Orders Management</CardTitle>
            <CardDescription>Manage all orders and track their status</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <FilterIcon className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">#{order.orderNumber}</div>
                      <div className="text-muted-foreground text-sm">{order.id.slice(0, 8)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.user.name}</div>
                      <div className="text-muted-foreground text-sm">{order.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.itemCount} items</TableCell>
                  <TableCell className="font-medium">
                    R{order.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                      {order.status.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge
                        variant="secondary"
                        className={
                          paymentStatusColors[
                            order.paymentStatus as keyof typeof paymentStatusColors
                          ]
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                      <div className="text-muted-foreground text-xs">{order.paymentMethod}</div>
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-muted-foreground text-sm">
            Showing {orders.length} of {total} orders
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrdersTable
