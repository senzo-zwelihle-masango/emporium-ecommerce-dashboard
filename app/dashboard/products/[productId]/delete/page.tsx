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

import { deleteProductAction } from '@/server/actions/dashboard/product'

type Params = Promise<{ productId: string }>

const DeleteProductPage = async ({ params }: { params: Params }) => {
  noStore()
  const { productId } = await params

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      brand: true,
      category: true,
      warehouse: true,
      promotion: true,
      swatch: true,
      favorites: true,
      reviews: true,
      orderItems: true,
    },
  })

  if (!product) {
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
            This action cannot be undone. This will permanently delete the following product:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            {product.images && product.images.length > 0 && (
              <Image
                src={product.images[0]}
                alt={`${product.name} product`}
                width={16}
                height={16}
                unoptimized
                className="h-16 w-16 object-contain"
              />
            )}
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">{product.name}</h3>
            <p className="text-muted-foreground">SKU: {product.sku}</p>
            <div className="text-center text-sm font-semibold">Brand: {product.brand.name}</div>
            <div className="text-center text-sm">Category: {product.category.name}</div>
            <div className="text-center text-sm">Price: R{product.price.toString()}</div>
            <div className="my-2 flex items-center justify-center space-x-2">
              <span className="font-semibold">{product.swatch.length}</span>
              <span className="text-muted-foreground text-sm">
                {product.swatch.length === 1 ? 'Swatch' : 'Swatches'}
              </span>
            </div>
            <div className="my-2 flex items-center justify-center space-x-2">
              <span className="font-semibold">{product.reviews.length}</span>
              <span className="text-muted-foreground text-sm">
                {product.reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/dashboard/products`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              'use server'
              await deleteProductAction(productId)
              redirect('/dashboard/products')
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default DeleteProductPage
