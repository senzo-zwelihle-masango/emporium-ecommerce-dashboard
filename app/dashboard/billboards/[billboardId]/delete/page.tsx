import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import Image from 'next/image'

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

import { deleteBillboardAction } from '@/server/actions/dashboard/billboard'

type Params = Promise<{ billboardId: string }>

const DeleteBillboardPage = async ({ params }: { params: Params }) => {
  noStore()
  const { billboardId } = await params

  const billboard = await prisma.billboard.findUnique({
    where: { id: billboardId },
    include: {
      category: true,
      featuredProduct: true,
    },
  })

  if (!billboard) {
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
            This action cannot be undone. This will permanently delete the following billboard:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            {billboard.image && (
              <Image
                src={billboard.image}
                alt={`${billboard.label} billboard`}
                width={16}
                height={16}
                unoptimized
                className="h-16 w-16 object-contain"
              />
            )}
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">{billboard.label}</h3>
            <p className="text-muted-foreground">{billboard.description}</p>
            <div className="text-center text-sm font-semibold">
              Category: {billboard.category.name}
            </div>
            {billboard.featuredProduct && (
              <div className="text-center text-sm">
                Featured Product: {billboard.featuredProduct.name}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/dashboard/billboards`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              'use server'
              await deleteBillboardAction(billboardId)
              redirect('/dashboard/billboards')
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default DeleteBillboardPage
