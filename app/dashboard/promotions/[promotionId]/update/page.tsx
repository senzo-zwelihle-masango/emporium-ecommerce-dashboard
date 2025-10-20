import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/container'

import { prisma } from '@/lib/prisma/client'

import UpdatePromotionForm from '@/components/dashboard/forms/update/update-promotion'

type Params = Promise<{ promotionId: string }>

// Fetch specific promotion
async function getPromotion(id: string) {
  noStore()
  const promotion = await prisma.promotion.findUnique({
    where: { id },
    select: {
      id: true,
      brandId: true,
      label: true,
      description: true,
      image: true,
      active: true,
      products: {
        select: {
          id: true,
        },
      },
      tags: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!promotion) {
    return notFound()
  }

  return {
    ...promotion,
    productIds: promotion.products.map((p) => p.id),
    tags: promotion.tags.map((t) => t.id),
  }
}

// Fetch existing products
async function getProducts() {
  noStore()
  return prisma.product.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
}

// Fetch existing brands
async function getBrands() {
  noStore()
  return prisma.brand.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
}

// Fetch existing tags
async function getTags() {
  noStore()
  return prisma.promotionTag.findMany({
    select: {
      id: true,
      label: true,
    },
  })
}

const UpdatePromotionPage = async ({ params }: { params: Params }) => {
  const { promotionId } = await params

  const [promotion, products, brands, promotionTags] = await Promise.all([
    getPromotion(promotionId),
    getProducts(),
    getBrands(),
    getTags(),
  ])

  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      id="update-promotion"
      className="my-4"
    >
      <UpdatePromotionForm
        promotion={promotion}
        products={products}
        brands={brands}
        tags={promotionTags}
      />
    </Container>
  )
}

export default UpdatePromotionPage
