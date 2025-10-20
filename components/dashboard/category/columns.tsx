'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import Link from 'next/link'
import { CopyIcon, FilePenIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'

// types
export type CategoryColumn = {
  id: string
  name: string
  active: boolean
  products: { id: string }[]
  collections: { id: string }[]
  billboards: { id: string }[]
  createdAt: Date
  updatedAt: Date
}

export const categoryColumns: ColumnDef<CategoryColumn>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Id" />,
    cell: ({ row }) => {
      const id: string = row.getValue('id')
      const truncatedId = id.slice(0, 8) + '...'
      return <span className="text-muted-foreground font-mono text-sm">{truncatedId}</span>
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'active',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const active = row.getValue('active')
      return active ? (
        <Badge variant="default">Active</Badge>
      ) : (
        <Badge variant="outline">Inactive</Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'products',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Products" />,
    cell: ({ row }) => {
      const products = row.original.products
      return <div>{products.length}</div>
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'collections',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Collections" />,
    cell: ({ row }) => {
      const collections = row.original.collections
      return <div>{collections.length}</div>
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'billboards',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Billboards" />,
    cell: ({ row }) => {
      const billboards = row.original.billboards
      return <div>{billboards.length}</div>
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => format(row.getValue('createdAt'), 'PPP'),
    enableSorting: true,
    enableHiding: true,
  },

  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
    cell: ({ row }) => {
      const category = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(category.id)}>
              Copy ID
              <CopyIcon />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/dashboard/categories/${category.id}/update`}>Update</Link>
              <FilePenIcon className="ml-1 size-4" />
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Link href={`/dashboard/categories/${category.id}/delete`}>Delete</Link>

              <Trash2Icon className="ml-2 size-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
