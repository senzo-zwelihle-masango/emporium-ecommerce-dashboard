import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'

import { prisma } from '@/lib/prisma/client'

import { Container } from '@/components/ui/container'

import CreateBillboardForm from '@/components/dashboard/forms/create/create-billboard'

// fetch existing categories
async function getCategories() {
  noStore()
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
  return categories
}

// fetch products
async function getProducts() {
  noStore()
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      brand: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
  return products
}

const CreateBillboardPage = async () => {
  noStore()
  const categories = await getCategories()
  const products = await getProducts()
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="create-billboard"
      className="my-4"
    >
      <CreateBillboardForm categories={categories} products={products} />
    </Container>
  )
}

export default CreateBillboardPage
