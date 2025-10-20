import { Decimal } from '@/lib/generated/prisma/runtime/library'
import { ProductStatus, ProductTag } from '@/lib/generated/prisma'

interface Warehouse {
  id: string
  name: string
  location: string
}

interface Brand {
  id: string
  name: string
  logo: string
  active: boolean
}

interface Category {
  id: string
  name: string
  active: boolean
}

interface Promotion {
  id: string
  label: string
  active: boolean
}

export type ProductServer = {
  id: string
  userId: string
  warehouseId: string
  warehouse: Warehouse
  brandId: string
  brand: Brand
  categoryId: string
  category: Category
  promotionId: string | null
  promotion: Promotion | null
  name: string
  slug: string
  sku: string
  price: Decimal
  stock: number
  productVariant: string | null
  productVariantValue: string | null
  description: string
  features: string
  specifications: string | null
  content: string | null
  images: string[]
  tag: ProductTag
  status: ProductStatus
  createdAt: Date
  updatedAt: Date
  reviews: { rating: number }[]
  favorites: { id: string }[]
  interactions: { type: string; timestamp: Date }[]
  featuredInBillboard: { id: string; label: string }[]
}

export type Product = {
  id: string
  userId: string
  warehouseId: string
  warehouse: Warehouse
  brandId: string
  brand: Brand
  categoryId: string
  category: Category
  promotionId: string | null
  promotion: Promotion | null
  name: string
  slug: string
  sku: string
  price: string
  stock: number
  productVariant: string | null
  productVariantValue: string | null
  description: string
  features: string
  specifications: string | null
  content: string | null
  images: string[]
  tag: ProductTag
  status: ProductStatus
  isFavorited?: boolean
  createdAt: Date
  updatedAt: Date
  reviews: { rating: number }[]
  favorites: { id: string }[]
  interactions: { type: string; timestamp: Date }[]
  featuredInBillboard: { id: string; label: string }[]
}

export function setStockStatus(
  stock: number,
  status: ProductStatus
): {
  label: string
  color: string
  isAvailable: boolean
} {
  const numericStock = typeof stock === 'number' ? stock : Number(stock)

  if (status === 'outofstock' || numericStock <= 0) {
    return {
      label: 'Out of Stock',
      color: 'bg-red-700',
      isAvailable: false,
    }
  }

  if (status === 'comingsoon') {
    return {
      label: 'Coming Soon',
      color: 'bg-blue-700',
      isAvailable: false,
    }
  }

  if (status === 'inactive') {
    return {
      label: 'Inactive',
      color: 'bg-zinc-700',
      isAvailable: false,
    }
  }

  if (status === 'archived') {
    return {
      label: 'Archived',
      color: 'bg-yellow-700',
      isAvailable: false,
    }
  }

  if (status === 'preorder') {
    return {
      label: 'Pre-Order',
      color: 'bg-violet-700',
      isAvailable: true,
    }
  }

  if (status === 'limitedstock' || (numericStock > 0 && numericStock <= 5)) {
    return {
      label: `Only ${numericStock} left`,
      color: 'bg-orange-700',
      isAvailable: true,
    }
  }

  if (status === 'active') {
    return {
      label: 'In Stock',
      color: 'bg-green-700',
      isAvailable: true,
    }
  }

  if (numericStock > 0) {
    return {
      label: 'In Stock',
      color: 'bg-green-700',
      isAvailable: true,
    }
  }

  return {
    label: 'Out of Stock',
    color: 'bg-red-700',
    isAvailable: false,
  }
}

export function setProductTag(tag: ProductTag): {
  label: string
  color: string
} {
  switch (tag) {
    case 'new':
      return { label: 'New', color: 'bg-green-700' }

    case 'bestseller':
      return { label: 'Best Seller', color: 'bg-yellow-700' }

    case 'limitedEdition':
      return { label: 'Limited Edition', color: 'bg-purple-700' }

    case 'exclusive':
      return { label: 'Exclusive', color: 'bg-pink-700' }

    case 'clearance':
      return { label: 'Clearance', color: 'bg-rose-700' }

    case 'backinstock':
      return { label: 'Back in Stock', color: 'bg-emerald-700' }

    case 'preorder':
      return { label: 'Pre-Order', color: 'bg-violet-700' }

    case 'featured':
      return { label: 'Featured', color: 'bg-blue-700' }

    default:
      return {
        label: tag,
        color: 'bg-gray-100',
      }
  }
}

// star rating
export function setAverageRating(reviews: { rating: number }[]) {
  if (reviews.length === 0) return 0
  const total = reviews.reduce((sum, review) => sum + review.rating, 0)
  return total / reviews.length
}

// Helper function to serialize server product for client
export function serializeProduct(product: ProductServer): Product {
  return {
    ...product,
    price: product.price.toString(),
  }
}

// Helper to get interaction stats
export function getInteractionStats(interactions: { type: string; timestamp: Date }[]) {
  const stats = interactions.reduce(
    (acc, interaction) => {
      acc[interaction.type] = (acc[interaction.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return {
    views: stats.view || 0,
    addToCart: stats.addtocart || 0,
    purchases: stats.purchase || 0,
    total: interactions.length,
  }
}

// Helper function to serialize multiple products
export function serializeProducts(products: ProductServer[]): Product[] {
  return products.map(serializeProduct)
}

// Southa local currency
export function formatPrice(price: string | Decimal) {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : Number(price)
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(numericPrice)
}

// Helper to convert string price back to number for calculations
export function getPriceAsNumber(price: string): number {
  return parseFloat(price)
}

export type ProductFilterParams = {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  tag?: ProductTag
  brand?: string
  warehouse?: string
  promotion?: string
  featured?: boolean
}
