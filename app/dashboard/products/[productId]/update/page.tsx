import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'

import { Container } from '@/components/ui/container'

import { prisma } from '@/lib/prisma/client'

import UpdateProductForm from '@/components/dashboard/forms/update/update-product'

type Params = Promise<{ productId: string }>

async function fetctProductId(id: string) {
  noStore()
  const data = await prisma.product.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      warehouseId: true,
      brandId: true,
      categoryId: true,
      promotionId: true,
      name: true,
      slug: true,
      sku: true,
      price: true,
      stock: true,
      productVariant: true,
      productVariantValue: true,
      description: true,
      features: true,
      specifications: true,
      content: true,
      images: true,
      tag: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!data) {
    return notFound()
  }

  return {
    ...data,
    price: Number(data.price),
    productVariant: data.productVariant ?? undefined,
    productVariantValue: data.productVariantValue ?? undefined,
    specifications: data.specifications ?? undefined,
    content: data.content ?? undefined,
    promotionId: data.promotionId ?? undefined,
  }
}

// fetch existing categories
async function fetchWarehouses() {
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

async function fetchBrands() {
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
async function fetchCategories() {
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

async function fetchPromotions() {
  const promotions = await prisma.promotion.findMany({
    select: {
      id: true,
      label: true,
    },
  })
  return promotions
}

const UpdateProductPage = async ({ params }: { params: Params }) => {
  const { productId } = await params

  // Fetch product + related data in parallel
  const [product, warehouses, brands, categories, promotions] = await Promise.all([
    fetctProductId(productId),
    fetchWarehouses(),
    fetchBrands(),
    fetchCategories(),
    fetchPromotions(),
  ])

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="update-product"
      className="my-4"
    >
      <UpdateProductForm
        warehouses={warehouses}
        categories={categories}
        brands={brands}
        promotions={promotions}
        product={product}
      />
    </Container>
  )
}

export default UpdateProductPage
