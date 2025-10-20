'use client'

import { Row } from '@tanstack/react-table'
import { MoreHorizontal, SquarePenIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { toast } from 'sonner'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

interface Collection {
  id: string
}

export function CollectionRowActions<TData extends Collection>({
  row,
}: DataTableRowActionsProps<TData>) {
  const collectionId = row.original.id

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>
          <Link href={`/dashboard/collections/${collectionId}/update`}>Update</Link>
          <SquarePenIcon />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            toast.info(`Delete category with ID: ${collectionId}`)
          }}
          variant="destructive"
        >
          <Link href={`/dashboard/collections/${collectionId}/delete`}>Delete</Link>
          <Trash2Icon className="text-destructive" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
