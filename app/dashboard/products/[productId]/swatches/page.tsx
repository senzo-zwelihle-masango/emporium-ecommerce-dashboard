import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { ArrowLeftIcon } from 'lucide-react'

import { prisma } from '@/lib/prisma/client'
import CreateSwatchForm from '@/components/dashboard/forms/create/create-swatch'

async function getProduct(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      swatch: {
        select: {
          id: true,
          type: true,
          name: true,
          value: true,
          images: true,
          status: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!product) {
    return notFound()
  }

  return product
}

type Params = Promise<{ productId: string }>

const SwatchesPage = async ({ params }: { params: Params }) => {
  const { productId } = await params
  const product = await getProduct(productId)

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="swatches"
      className="my-4 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/products/${productId}`}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <Heading size="sm" spacing="normal" lineHeight="none" margin="none">
            {product.name}
          </Heading>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Create Form */}
        <div>
          <Heading size="sm" spacing="normal" lineHeight="none" margin="md">
            Add New Swatch
          </Heading>
          <CreateSwatchForm productId={productId} />
        </div>

        {/* Existing Swatches */}
        <div>
          <Heading size="sm" spacing="normal" lineHeight="none" margin="md">
            Existing Swatches ({product.swatch.length})
          </Heading>
          {product.swatch.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">No swatches created yet</div>
          ) : (
            <div className="space-y-4">
              {product.swatch.map((swatch) => (
                <div
                  key={swatch.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <h4 className="font-semibold">{swatch.name}</h4>
                    <p className="text-muted-foreground text-sm">
                      {swatch.type} - {swatch.value}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/products/${productId}/swatches/${swatch.id}/update`}>
                        Edit
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="destructive">
                      <Link href={`/dashboard/products/${productId}/swatches/${swatch.id}/delete`}>
                        Delete
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

export default SwatchesPage
