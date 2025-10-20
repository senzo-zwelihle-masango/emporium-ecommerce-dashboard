import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { Container } from '@/components/ui/container'

import { prisma } from '@/lib/prisma/client'

import CreatePromotionForm from '@/components/dashboard/forms/create/create-promotion'

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

const CreatePromotionPage = async () => {
  noStore()
  const [products, brands, promotionTags] = await Promise.all([
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
      id="create-promotion"
      className="my-4"
    >
      <CreatePromotionForm products={products} brands={brands} tags={promotionTags} />
    </Container>
  )
}

export default CreatePromotionPage
