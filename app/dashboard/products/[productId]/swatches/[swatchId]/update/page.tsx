import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { ArrowLeftIcon } from 'lucide-react'

import { prisma } from '@/lib/prisma/client'
import UpdateSwatchForm from '@/components/dashboard/forms/update/update-swatch'

async function getSwatch(swatchId: string) {
  const swatch = await prisma.productSwatch.findUnique({
    where: { id: swatchId },
    select: {
      id: true,
      productId: true,
      type: true,
      name: true,
      value: true,
      images: true,
      status: true,
      product: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!swatch) {
    return notFound()
  }

  return swatch
}

type Params = Promise<{ productId: string; swatchId: string }>

const UpdateSwatchPage = async ({ params }: { params: Params }) => {
  const { productId, swatchId } = await params
  const swatch = await getSwatch(swatchId)

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="update-swatch"
      className="my-4 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/products/${productId}/swatches`}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <Heading size="sm" spacing="normal" lineHeight="none" margin="none">
            {swatch.name}
          </Heading>
          <p className="text-muted-foreground">Product: {swatch.product.name}</p>
        </div>
      </div>

      <UpdateSwatchForm swatch={swatch} />
    </Container>
  )
}

export default UpdateSwatchPage
