'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Row } from '@tanstack/react-table'
import { MoreHorizontal, Package, CreditCard, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { orderSchema } from '@/components/dashboard/order/data/schema'
import UpdateOrderStatusForm from '@/components/dashboard/forms/update/update-order-status'
import UpdatePaymentStatusForm from '@/components/dashboard/forms/update/update-payment-status'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const order = orderSchema.parse(row.original)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted size-8">
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/orders/${order.id}`}>
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyOrderId}>Copy Order ID</DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setStatusDialogOpen(true)}>
            <Package className="h-4 w-4" />
            Update Status
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPaymentDialogOpen(true)}>
            <CreditCard className="h-4 w-4" />
            Update Payment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <UpdateOrderStatusForm
            orderId={order.id}
            currentStatus={order.status}
            onSuccess={() => setStatusDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
          </DialogHeader>
          <UpdatePaymentStatusForm
            orderId={order.id}
            currentPaymentStatus={order.paymentStatus}
            onSuccess={() => setPaymentDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
