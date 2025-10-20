import React from 'react'
import Link from 'next/link'
import { TrashIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { DeleteButton } from '@/components/ui/form-button'

import { deleteAdminOrderAction } from '@/server/actions/dashboard/order'

type Params = Promise<{ orderId: string }>

const DeleteOrderRoutePage = async ({ params }: { params: Params }) => {
  // console.log("DeleteNoteRoute Params:", params);
  const { orderId } = await params
  // console.log("billboardId:", billboardId);
  return (
    <Container>
      <Card className="mx-auto my-40 w-full max-w-lg">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete this order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          Order: <span>{orderId}</span>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" size={'default'}>
            <Link href={`/dashboard/orders`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              'use server'
              await deleteAdminOrderAction(orderId)
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default DeleteOrderRoutePage
