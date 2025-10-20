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

import { deleteSwatchAction } from '@/server/actions/dashboard/swatch'

type Params = Promise<{ productId: string; swatchId: string }>

const DeleteSwatchPage = async ({ params }: { params: Params }) => {
  noStore()
  const { productId, swatchId } = await params

  const swatch = await prisma.productSwatch.findUnique({
    where: { id: swatchId },
    include: {
      product: true,
    },
  })

  if (!swatch) {
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
            This action cannot be undone. This will permanently delete the following swatch:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            {swatch.images && swatch.images.length > 0 && (
              <Image
                src={swatch.images[0]}
                alt={`${swatch.name} swatch`}
                width={16}
                height={16}
                unoptimized
                className="h-16 w-16 object-contain"
              />
            )}
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">{swatch.name}</h3>
            <div className="text-center text-sm font-semibold">Type: {swatch.type}</div>
            <div className="text-center text-sm">Value: {swatch.value}</div>
            <div className="text-center text-sm">Product: {swatch.product.name}</div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/dashboard/products/${productId}/swatches`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              'use server'
              await deleteSwatchAction(swatchId)
              redirect(`/dashboard/products/${productId}/swatches`)
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default DeleteSwatchPage
