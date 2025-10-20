import React from 'react'
import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'

import { prisma } from '@/lib/prisma/client'

import { Container } from '@/components/ui/container'

import UpdateBillboardForm from '@/components/dashboard/forms/update/update-billboard'

type Params = Promise<{ billboardId: string }>

async function fetchBillboardId(id: string) {
  noStore()
  const data = await prisma.billboard.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      label: true,
      description: true,
      category: true,
      categoryId: true,
      image: true,
      status: true,
      featuredProductId: true,

      createdAt: true,
      updatedAt: true,
    },
  })

  if (!data) {
    return notFound()
  }

  return data
}

// fetch all categories
async function fetchCategories() {
  noStore()
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  })

  return categories
}

//  fetch all products
async function fetchProducts() {
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

const UpdateCollectionPage = async ({ params }: { params: Params }) => {
  noStore()
  const { billboardId } = await params

  const [data, categories, products] = await Promise.all([
    fetchBillboardId(billboardId),
    fetchCategories(),
    fetchProducts(),
  ])

  return (
    <Container
      id="categories"
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-sm'}
      className="my-4"
    >
      <UpdateBillboardForm data={data} categories={categories} products={products} />
    </Container>
  )
}

export default UpdateCollectionPage
