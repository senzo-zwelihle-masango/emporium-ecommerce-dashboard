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

import { deleteBrandAction } from '@/server/actions/dashboard/brand'

type Params = Promise<{ brandId: string }>

const DeleteBrandPage = async ({ params }: { params: Params }) => {
  noStore()
  const { brandId } = await params

  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
    include: {
      products: true,
      promotions: true,
    },
  })

  if (!brand) {
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
            This action cannot be undone. This will permanently delete the following brand:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            {brand.logo && (
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                width={16}
                height={16}
                unoptimized
                className="h-16 w-16 object-contain"
              />
            )}
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">{brand.name}</h3>
            <div className="my-2 flex items-center justify-center space-x-2">
              <span className="font-semibold">{brand.products.length}</span>
              <span className="text-muted-foreground text-sm">
                {brand.products.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>
            <div className="my-2 flex items-center justify-center space-x-2">
              <span className="font-semibold">{brand.promotions.length}</span>
              <span className="text-muted-foreground text-sm">
                {brand.promotions.length === 1 ? 'Promotion' : 'Promotions'}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/dashboard/brands`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              'use server'
              await deleteBrandAction(brandId)
              redirect('/dashboard/brands')
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default DeleteBrandPage
