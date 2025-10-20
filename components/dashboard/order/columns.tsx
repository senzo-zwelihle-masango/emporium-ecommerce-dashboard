'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { Checkbox } from '@/components/ui/checkbox'

import { DataTableColumnHeader } from '@/components/dashboard/order/data-table-column-header'
import { DataTableRowActions } from '@/components/dashboard/order/data-table-row-actions'
import { Order } from '@/components/dashboard/order/data/schema'
import { statuses, paymentMethods, paymentStatuses } from '@/components/dashboard/order/data/data'
import { Decimal } from '@/lib/generated/prisma/runtime/library'

// Southa local currency
function formatPrice(price: string | Decimal) {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : Number(price)
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(numericPrice)
}

export const columns: ColumnDef<Order>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'orderNumber',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order #" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('orderNumber')}</div>,
  },
  {
    accessorKey: 'userName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => {
      const userName = row.original.userName
      const userEmail = row.original.userEmail

      return (
        <div className="flex flex-col">
          <span className="font-medium">{userName || 'N/A'}</span>
          {userEmail && <span className="text-muted-foreground text-sm">{userEmail}</span>}
        </div>
      )
    },
  },
  {
    accessorKey: 'totalAmount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'))
      return <div className="font-medium">{formatPrice(amount.toString())}</div>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = statuses.find((status) => status.value === row.getValue('status'))

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payment Method" />,
    cell: ({ row }) => {
      const paymentMethod = paymentMethods.find(
        (method) => method.value === row.getValue('paymentMethod')
      )

      if (!paymentMethod) {
        return <span className="text-muted-foreground">N/A</span>
      }

      return (
        <div className="flex items-center">
          {paymentMethod.icon && (
            <paymentMethod.icon className="text-muted-foreground mr-2 h-4 w-4" />
          )}
          <span>{paymentMethod.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payment Status" />,
    cell: ({ row }) => {
      const paymentStatus = paymentStatuses.find(
        (status) => status.value === row.getValue('paymentStatus')
      )

      if (!paymentStatus) {
        return null
      }

      return (
        <div className="flex items-center">
          {paymentStatus.icon && (
            <paymentStatus.icon className="text-muted-foreground mr-2 h-4 w-4" />
          )}
          <span>{paymentStatus.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return <span>{format(date, 'MMM dd, yyyy')}</span>
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
