import 'server-only'

import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'
import { ProductServer } from '@/types/dashboard/product'

export async function fetchAllProducts(): Promise<ProductServer[]> {
  noStore()
  const data = await prisma.product.findMany({
    select: {
      id: true,
      userId: true,
      warehouseId: true,
      warehouse: true,
      categoryId: true,
      category: true,
      promotionId: true,
      promotion: true,
      brandId: true,
      brand: true,
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
      reviews: {
        select: {
          rating: true,
        },
      },
      favorites: {
        select: {
          id: true,
        },
      },
      interactions: {
        select: {
          type: true,
          timestamp: true,
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: 100,
      },
      featuredInBillboard: {
        select: {
          id: true,
          label: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return data
}
