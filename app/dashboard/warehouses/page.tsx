import React from 'react'
import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { FilePenIcon, MoreHorizontalIcon, PlusIcon, Trash2Icon } from 'lucide-react'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { fetchAllWarehouses } from '@/app/api/dashboard/warehouse'

const WarehousesPage = async () => {
  noStore()
  const warehouses = await fetchAllWarehouses()
  return (
    <Container
      id="warehouses"
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      className="my-4"
    >
      {/* header */}
      <div className="mb-5 flex items-center justify-between">
        <Heading
          size={'5xl'}
          spacing={'normal'}
          lineHeight={'none'}
          weight={'bold'}
          margin={'none'}
        >
          Warehouses
        </Heading>

        <Button>
          <PlusIcon />
          <Link href={'/dashboard/warehouses/create'}>Create New</Link>
        </Button>
      </div>
      {/* data */}
      <div>
        <Table>
          <TableHeader className="bg-transparent">
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
            {warehouses.map((item) => (
              <TableRow
                key={item.id}
                className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"
              >
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.products.length}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/dashboard/warehouses/${item.id}/update`}>Update</Link>
                        <FilePenIcon className="ml-1 size-4" />
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">
                        <Link href={`/dashboard/warehouses/${item.id}/delete`}>Delete</Link>

                        <Trash2Icon className="ml-2 size-4" />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  )
}

export default WarehousesPage
