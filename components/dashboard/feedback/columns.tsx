'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/dashboard/feedback/data-table-column-header'
import { DataTableRowActions } from '@/components/dashboard/feedback/data-table-row-actions'
import { Review, Experience } from '@/components/dashboard/feedback/data/schema'
import { reviewStatuses } from '@/components/dashboard/feedback/data/data'
import Image from 'next/image'

// Reviews columns
export const reviewColumns: ColumnDef<Review>[] = [
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
    accessorKey: 'user',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => {
      const user = row.original.user

      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-muted-foreground text-sm">{user.email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'product',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Product" />,
    cell: ({ row }) => {
      const product = row.original.product
      const imageUrl = product.images?.[0] || ''

      return (
        <div className="flex items-center gap-2">
          {imageUrl && (
            <div className="relative h-10 w-10 overflow-hidden rounded-md">
              <Image
                src={imageUrl}
                alt={product.name}
                width={10}
                height={10}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium">{product.name}</span>
            <span className="text-muted-foreground text-sm">{product.brand.name}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
    cell: ({ row }) => {
      const rating = row.getValue('rating') as number

      return (
        <div className="flex items-center gap-1">
          <span className="font-medium">{rating}</span>
          <span className="text-muted-foreground">/ 5</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'comment',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Comment" />,
    cell: ({ row }) => {
      const comment = row.getValue('comment') as string

      return (
        <div className="max-w-xs truncate" title={comment}>
          {comment}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = reviewStatuses.find((s) => s.value === row.getValue('status'))

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
    cell: ({ row }) => <DataTableRowActions row={row} type="review" />,
  },
]

// Experiences columns
export const experienceColumns: ColumnDef<Experience>[] = [
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
    accessorKey: 'user',
    header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
    cell: ({ row }) => {
      const user = row.original.user

      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-muted-foreground text-sm">{user.email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
    cell: ({ row }) => {
      const rating = row.getValue('rating') as number

      return (
        <div className="flex items-center gap-1">
          <span className="font-medium">{rating}</span>
          <span className="text-muted-foreground">/ 5</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'comment',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Comment" />,
    cell: ({ row }) => {
      const comment = row.getValue('comment') as string | null

      return comment ? (
        <div className="max-w-xs truncate" title={comment}>
          {comment}
        </div>
      ) : (
        <span className="text-muted-foreground">No comment</span>
      )
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
    cell: ({ row }) => <DataTableRowActions row={row} type="experience" />,
  },
]
