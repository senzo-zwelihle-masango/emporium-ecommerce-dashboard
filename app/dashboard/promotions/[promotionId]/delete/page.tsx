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

import { deletePromotionAction } from '@/server/actions/dashboard/promotion'

type Params = Promise<{ promotionId: string }>

const DeletePromotionPage = async ({ params }: { params: Params }) => {
  noStore()
  const { promotionId } = await params

  const promotion = await prisma.promotion.findUnique({
    where: { id: promotionId },
    include: {
      brand: true,
      products: true,
      tags: true,
    },
  })

  if (!promotion) {
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
            This action cannot be undone. This will permanently delete the following promotion:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            {promotion.image && (
              <Image
                src={promotion.image}
                alt={`${promotion.label} promotion`}
                width={16}
                height={16}
                unoptimized
                className="h-16 w-16 object-contain"
              />
            )}
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">{promotion.label}</h3>
            <p className="text-muted-foreground">{promotion.description}</p>
            <div className="text-center text-sm font-semibold">Brand: {promotion.brand.name}</div>
            <div className="my-2 flex items-center justify-center space-x-2">
              <span className="font-semibold">{promotion.products.length}</span>
              <span className="text-muted-foreground text-sm">
                {promotion.products.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>
            {promotion.tags.length > 0 && (
              <div className="text-center text-sm">
                Tags: {promotion.tags.map((tag) => tag.label).join(', ')}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/dashboard/promotions`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              'use server'
              await deletePromotionAction(promotionId)
              redirect('/dashboard/promotions')
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default DeletePromotionPage
