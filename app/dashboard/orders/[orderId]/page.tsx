import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import {
  ChevronLeftIcon,
  Package,
  User,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import UpdateOrderStatusForm from '@/components/dashboard/forms/update/update-order-status'
import UpdatePaymentStatusForm from '@/components/dashboard/forms/update/update-payment-status'

import { prisma } from '@/lib/prisma/client'
import { Decimal } from '@/lib/generated/prisma/runtime/library'

function formatPrice(price: string | Decimal) {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : Number(price)
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(numericPrice)
}

async function getOrderData({ orderId }: { orderId: string }) {
  noStore()

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        shipping: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return notFound()
    }

    return order
  } catch {
    return notFound()
  }
}

type Params = Promise<{ orderId: string }>

const AdminOrderDetailsPage = async ({ params }: { params: Params }) => {
  const { orderId } = await params
  const order = await getOrderData({ orderId })

  const getStatusVariant = (status: string) => {
    const variants = {
      pending: 'secondary',
      confirmed: 'default',
      processing: 'default',
      packed: 'default',
      shipped: 'default',
      outfordelivery: 'default',
      delivered: 'default',
      cancelled: 'destructive',
      returned: 'destructive',
    }
    return variants[status as keyof typeof variants] || 'secondary'
  }

  const getPaymentStatusVariant = (status: string) => {
    const variants = {
      pending: 'secondary',
      paid: 'default',
      failed: 'destructive',
      refunded: 'secondary',
      partiallyrefunded: 'secondary',
      authorized: 'default',
    }
    return variants[status as keyof typeof variants] || 'secondary'
  }

  return (
    <div>
      <Container
        size={'2xl'}
        alignment={'none'}
        height={'full'}
        padding={'px-sm'}
        gap={'none'}
        flow={'none'}
        id="order-id"
        className="my-4"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/orders">
                <ChevronLeftIcon className="h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
            {/* <div>
              <Heading size="lg">
                Order #{order.orderNumber.substring(0, 8).toUpperCase()}
              </Heading>
              <p className="text-sm text-muted-foreground mt-1">
                Created {formattedOrderDate}
              </p>
            </div> */}
          </div>
          <div className="flex gap-2">
            <Badge
              variant={
                getStatusVariant(order.status) as
                  | 'default'
                  | 'secondary'
                  | 'destructive'
                  | 'outline'
              }
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <Badge
              variant={
                getPaymentStatusVariant(order.paymentStatus) as
                  | 'default'
                  | 'secondary'
                  | 'destructive'
                  | 'outline'
              }
            >
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Order Items - Takes up 8 columns */}
          <div className="col-span-12 lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {item.product.images[0] && (
                              <div className="bg-muted relative h-12 w-12 overflow-hidden rounded-md">
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {item.product.sku}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(item.price.toString())}
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice((Number(item.price) * item.quantity).toString())}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Order Summary */}
                <div className="border-t p-6">
                  <div className="ml-auto max-w-sm space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatPrice(order.totalAmount.toString())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping:</span>
                      <span>{formatPrice(order.shippingCost.toString())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>VAT:</span>
                      <span>{formatPrice(order.vatAmount.toString())}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                      <span>Total:</span>
                      <span>
                        {formatPrice(
                          (
                            Number(order.totalAmount) +
                            Number(order.shippingCost) +
                            Number(order.vatAmount)
                          ).toString()
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Management Forms - Moved under order items */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Update Order Status Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Update Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-muted-foreground mb-2 text-sm">Current Status</p>
                    <Badge
                      variant={
                        getStatusVariant(order.status) as
                          | 'default'
                          | 'secondary'
                          | 'destructive'
                          | 'outline'
                      }
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <UpdateOrderStatusForm orderId={order.id} currentStatus={order.status} />
                </CardContent>
              </Card>

              {/* Update Payment Status Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Update Payment Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-muted-foreground mb-2 text-sm">Current Payment Status</p>
                    <Badge
                      variant={
                        getPaymentStatusVariant(order.paymentStatus) as
                          | 'default'
                          | 'secondary'
                          | 'destructive'
                          | 'outline'
                      }
                    >
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                  <UpdatePaymentStatusForm
                    orderId={order.id}
                    currentPaymentStatus={order.paymentStatus}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar - Enhanced Grid Layout - Takes up 4 columns */}
          <div className="col-span-12 grid grid-cols-1 gap-6 lg:col-span-4">
            {/* Enhanced Customer Card */}
            <Card className="relative overflow-hidden">
              <div className="from-primary/5 to-primary/10 absolute inset-0 bg-gradient-to-br" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
                    {order.user.image ? (
                      <Image
                        src={order.user.image}
                        alt={order.user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="text-primary h-8 w-8" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{order.user.name}</p>
                    <p className="text-muted-foreground text-sm">{order.user.email}</p>
                    {order.user.phoneNumber && (
                      <p className="text-muted-foreground text-sm">{order.user.phoneNumber}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-muted-foreground text-xs tracking-wide uppercase">Role</p>
                    <Badge variant="secondary" className="mt-1">
                      {order.user.role}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs tracking-wide uppercase">
                      Member Since
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {format(new Date(order.user.createdAt), 'MMM yyyy')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Payment Method */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium capitalize">
                    {order.paymentMethod.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <Badge
                    variant={
                      getPaymentStatusVariant(order.paymentStatus) as
                        | 'default'
                        | 'secondary'
                        | 'destructive'
                        | 'outline'
                    }
                    className="mt-2"
                  >
                    {order.paymentStatus}
                  </Badge>
                </CardContent>
              </Card>

              {/* Order Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">
                    {formatPrice(
                      (
                        Number(order.totalAmount) +
                        Number(order.shippingCost) +
                        Number(order.vatAmount)
                      ).toString()
                    )}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">{order.items.length} items</p>
                </CardContent>
              </Card>
            </div>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                    <Truck className="text-primary h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{order.shipping.fullName}</p>
                    <p className="text-muted-foreground text-sm">{order.shipping.phoneNumber}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>{order.shipping.streetAddress}</p>
                      {order.shipping.streetAddress2 && <p>{order.shipping.streetAddress2}</p>}
                      <p>
                        {order.shipping.suburb}, {order.shipping.city}
                      </p>
                      <p>
                        {order.shipping.province} {order.shipping.postalCode}
                      </p>
                      <p className="font-medium">{order.shipping.country}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Order Placed</span>
                  <span className="text-sm font-medium">
                    {format(order.createdAt, 'MMM dd, HH:mm')}
                  </span>
                </div>
                {order.expectedDeliveryDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Expected Delivery</span>
                    <span className="text-sm font-medium">
                      {format(order.expectedDeliveryDate, 'MMM dd')}
                    </span>
                  </div>
                )}
                {order.actualDeliveryDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Delivered</span>
                    <span className="text-sm font-medium">
                      {format(order.actualDeliveryDate, 'MMM dd, HH:mm')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {order.customerNotes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Customer Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm">{order.customerNotes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default AdminOrderDetailsPage
