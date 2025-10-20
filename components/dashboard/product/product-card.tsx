import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  formatPrice,
  Product,
  setAverageRating,
  setProductTag,
  setStockStatus,
  getInteractionStats,
} from '@/types/dashboard/product'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Star,
  Package,
  MoreHorizontalIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  Heart,
  TrendingUp,
  Award,
  Tag,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const productAverageRating = setAverageRating(product.reviews)
  const productFormattedPrice = formatPrice(product.price)
  const productStockStatus = setStockStatus(product.stock, product.status)
  const productTag = setProductTag(product.tag)
  const interactionStats = getInteractionStats(product.interactions || [])
  const favoritesCount = product.favorites?.length || 0
  const isFeatured = product.featuredInBillboard?.length > 0
  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0] || '/svg/vercel-placeholder.svg?height=300&width=300'}
            alt={product.name}
            fill
            quality={95}
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Stock status badge */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {productStockStatus.label && (
              <Badge className={`${productStockStatus.color}`}>{productStockStatus.label}</Badge>
            )}
            {isFeatured && (
              <Badge className="bg-amber-600">
                <Award className="mr-1 h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>

          {/* Product tag and promotion badges */}
          <div className="absolute bottom-2 left-2 flex flex-col gap-1">
            {productTag.label && (
              <Badge className={`${productTag.color}`}>{productTag.label}</Badge>
            )}
            {product.promotion && (
              <Badge className="bg-red-600">
                <Tag className="mr-1 h-3 w-3" />
                {product.promotion.label}
              </Badge>
            )}
          </div>

          {/* Dropdown menu */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontalIcon />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/admin/products/${product.id}`}>
                    <EyeIcon />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/products/${product.id}/update`}>
                    <EditIcon />
                    Update
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild variant="destructive">
                  <Link href={`/admin/products/${product.id}/delete`}>
                    <TrashIcon />
                    Delete
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-1">
              <h3 className="line-clamp-2 text-lg leading-tight font-semibold">{product.name}</h3>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>Brand: {product.brand.name}</span>
                <span>•</span>
                <div className="flex items-center gap-1">{product.warehouse.name}</div>
              </div>
            </div>
          </div>

          {/* Star rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(productAverageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">({product.reviews.length})</span>
          </div>

          {/* Price and stock */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{productFormattedPrice}</div>

            {productStockStatus.label && (
              <Badge className={`${productStockStatus.color}`}>
                <Package className="mr-1 h-4 w-4" />
                {productStockStatus.label}
              </Badge>
            )}
          </div>

          {/* SKU and stock label */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">SKU: {product.sku}</span>
          </div>

          {/* Variant */}
          {product.productVariant && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {product.productVariant}: {product.productVariantValue}
              </Badge>
            </div>
          )}

          {/* Interaction stats */}
          <div className="text-muted-foreground flex items-center justify-between border-t pt-2 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <EyeIcon className="h-3 w-3" />
                {interactionStats.views}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {favoritesCount}
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {interactionStats.total}
              </div>
            </div>
            <div className="text-xs">{product.warehouse.location}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full gap-2">
          <Button asChild className="flex-1">
            <Link href={`/admin/products/${product.id}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
