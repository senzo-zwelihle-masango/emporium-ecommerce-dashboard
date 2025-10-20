import React from 'react'

import { prisma } from '@/lib/prisma/client'

import { Container } from '@/components/ui/container'

import CreateProductForm from '@/components/dashboard/forms/create/create-product'

// fetch existing categories
async function getWarehouses() {
  const warehouses = await prisma.warehouse.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
  return warehouses
}

async function getBrands() {
  const brands = await prisma.brand.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
  return brands
}
async function getCategories() {
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

async function getPromotions() {
  const promotions = await prisma.promotion.findMany({
    select: {
      id: true,
      label: true,
    },
  })
  return promotions
}

const CreateProductPage = async () => {
  const categories = await getCategories()
  const warehouses = await getWarehouses()
  const brands = await getBrands()
  const promotions = await getPromotions()

  return (
    <Container
      id="analytics"
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      className="my-4"
    >
      <CreateProductForm
        warehouses={warehouses}
        categories={categories}
        brands={brands}
        promotions={promotions}
      />
    </Container>
  )
}

export default CreateProductPage
