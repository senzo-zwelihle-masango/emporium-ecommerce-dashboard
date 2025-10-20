'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { CollectionRowActions } from './actions'
import Image from 'next/image'

export type CollectionRow = {
  id: string
  label: string
  description: string | null
  color: string | null
  image: string
  status: 'active' | 'inactive' | 'draft' | 'review' | 'archived'
  createdAt: Date
  category?: { name: string } | null
  user?: { name: string } | null
}

export const columns: ColumnDef<CollectionRow>[] = [
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => (
      <div className="h-12 w-12 overflow-hidden rounded-md">
        <Image
          src={row.original.image}
          alt={row.original.label}
          width={12}
          height={12}
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => row.original.description ?? '-',
  },
  {
    accessorKey: 'color',
    header: 'Color',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.color ? (
          <>
            <div
              className="h-4 w-4 rounded-full border"
              style={{ backgroundColor: row.original.color }}
            />
            <span>{row.original.color}</span>
          </>
        ) : (
          '-'
        )}
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => row.original.category?.name ?? '-',
  },
  {
    accessorKey: 'user',
    header: 'Created By',
    cell: ({ row }) => row.original.user?.name ?? '-',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'default' : 'outline'}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => format(new Date(row.original.createdAt), 'PPP'),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CollectionRowActions row={row} />,
  },
]
