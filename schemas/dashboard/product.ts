import { z } from 'zod'
import { ProductStatus, ProductTag } from '@/lib/generated/prisma'

export const productSchema = z.object({
  warehouseId: z.string().min(1, 'Warehouse is required'),
  brandId: z.string().min(1, 'Brand is required'),
  categoryId: z.string().min(1, 'Category is required'),
  promotionId: z.string().optional().nullable(),
  name: z.string().min(1, 'Product name is required').max(100),
  slug: z.string().min(1, 'Product slug is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0, 'Price must be a positive number').multipleOf(0.01),
  stock: z.number().min(0, 'Stock must be at least 0'),
  productVariant: z.string().optional(),
  productVariantValue: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  features: z.string().min(1, 'Features are required'),
  specifications: z.string().optional(),
  content: z.string().optional(),
  images: z.array(z.url('Invalid image URL')).min(1, 'At least one image is required'),
  tag: z.enum(ProductTag),
  status: z.enum(ProductStatus),
})

export type ProductSchemaType = z.infer<typeof productSchema>
