'use client'

import Link from 'next/link'
import { Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { reviewSchema, experienceSchema } from '@/components/dashboard/feedback/data/schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  type: 'review' | 'experience'
}

export function DataTableRowActions<TData>({ row, type }: DataTableRowActionsProps<TData>) {
  const item =
    type === 'review' ? reviewSchema.parse(row.original) : experienceSchema.parse(row.original)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted size-8">
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>
          <Link href={`/dashboard/feedback/${type}/${item.id}`}>View Details</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Copy ID</DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/dashboard/feedback/${type}/${item.id}/update`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <Link href={`/dashboard/feedback/${type}/${item.id}/delete`}>Delete</Link>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
