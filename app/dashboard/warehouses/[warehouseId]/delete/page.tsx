import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'

import { prisma } from '@/lib/prisma/client'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { DeleteButton } from '@/components/ui/form-button'

import { deleteWarehouseAction } from '@/server/actions/dashboard/warehouse'

type Params = Promise<{ warehouseId: string }>

const DeleteWarehousePage = async ({ params }: { params: Params }) => {
  noStore()
  const { warehouseId } = await params

  const warehouse = await prisma.warehouse.findUnique({
    where: { id: warehouseId },
    include: {
      products: true,
    },
  })

  if (!warehouse) {
    return notFound()
  }

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="delete"
      className="my-4"
    >
      <Card className="bg-background mx-auto w-full max-w-lg">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the following warehouse:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">{warehouse.name}</h3>
            <p className="text-muted-foreground">{warehouse.description}</p>
            <div className="my-2 flex items-center justify-center space-x-2">
              <span className="font-semibold">{warehouse.products.length}</span>
              <span className="text-muted-foreground text-sm">
                {warehouse.products.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>
            <div className="text-center text-sm font-semibold">Location: {warehouse.location}</div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/dashboard/warehouses`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              'use server'
              await deleteWarehouseAction(warehouseId)
              redirect('/dashboard/warehouses')
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default DeleteWarehousePage
