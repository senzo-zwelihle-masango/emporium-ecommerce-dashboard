import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeftIcon,
  EditIcon,
  PackageIcon,
  StarIcon,
  TagIcon,
  TrashIcon,
  Warehouse,
  Heart,
  TrendingUp,
  Award,
  Eye,
  ShoppingBagIcon,
} from 'lucide-react'

import { prisma } from '@/lib/prisma/client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/ui/container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProductImageSwitcher from '@/components/dashboard/product/product-image-switcher'
import BlockNoteRender from '@/components/tools/blocknote-render'

import {
  formatPrice,
  setAverageRating,
  setProductTag,
  setStockStatus,
  getInteractionStats,
} from '@/types/dashboard/product'

async function getProductData({ productId }: { productId: string }) {
  const productPost = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      warehouseId: true,
      warehouse: true,
      brandId: true,
      brand: true,
      categoryId: true,
      category: true,
      promotionId: true,
      promotion: true,
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
          id: true,
          rating: true,
          comment: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
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
      },
      featuredInBillboard: {
        select: {
          id: true,
          label: true,
        },
      },
      swatch: {
        select: {
          id: true,
          type: true,
          name: true,
          value: true,
          images: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  if (!productPost) {
    return notFound()
  }

  return productPost
}

type Params = Promise<{ productId: string }>

const ProductIdRoutePage = async ({ params }: { params: Params }) => {
  const { productId } = await params
  const productPost = await getProductData({ productId })

  if (!productPost) {
    return notFound()
  }

  const productFormattedPrice = formatPrice(productPost.price)
  const averageRating = setAverageRating(productPost.reviews)
  const productStockStatus = setStockStatus(productPost.stock, productPost.status)
  const productTag = setProductTag(productPost.tag)
  const interactionStats = getInteractionStats(productPost.interactions || [])
  const favoritesCount = productPost.favorites?.length || 0
  const isFeatured = productPost.featuredInBillboard?.length > 0

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="view-product"
      className="my-4 space-y-4"
    >
      <div className="my-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/products">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{productPost.name}</h1>
            <p className="text-muted-foreground">Product Details</p>
          </div>
          <Button asChild>
            <Link href={`/dashboard/products/${productPost.id}/update`}>
              <EditIcon />
              Edit Product
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Product Images */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ProductImageSwitcher images={productPost.images} />
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:col-span-2">
            {/* Product Header */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <h1 className="text-3xl leading-tight font-bold">{productPost.name}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    {productStockStatus.label && (
                      <Badge className={`${productStockStatus.color}`}>
                        {productStockStatus.label}
                      </Badge>
                    )}
                    {productTag.label && (
                      <Badge className={`${productTag.color}`}>
                        <TagIcon className="mr-1 h-3 w-3" />
                        {productTag.label}
                      </Badge>
                    )}
                    {productPost.promotion && (
                      <Badge className="bg-red-600">
                        <TagIcon className="mr-1 h-3 w-3" />
                        {productPost.promotion.label}
                      </Badge>
                    )}
                    {isFeatured && (
                      <Badge className="bg-amber-600">
                        <Award className="mr-1 h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-primary text-3xl font-bold">{productFormattedPrice}</div>
                </div>
              </div>
            </div>

            {/* Product Information Card */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-muted-foreground text-xs font-medium tracking-wide">
                      Brand
                    </label>
                    <p className="mt-1 font-medium">{productPost.brand.name}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-medium tracking-wide">
                      SKU
                    </label>
                    <p className="mt-1">{productPost.sku}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-medium tracking-wide">
                      Category
                    </label>
                    <p className="mt-1 font-medium">{productPost.category.name}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-medium tracking-wide">
                      Status
                    </label>
                    <p className="mt-1 font-medium capitalize">{productPost.status}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-medium tracking-wide">
                      Slug
                    </label>
                    <p className="mt-1">{productPost.slug}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-medium tracking-wide">
                      Created
                    </label>
                    <p className="mt-1">{productPost.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-medium tracking-wide">
                      Stock
                    </label>
                    <p className="mt-1">{productPost.stock}</p>
                  </div>
                  {productPost.productVariant && (
                    <>
                      <div>
                        <label className="text-muted-foreground text-xs font-medium tracking-wide">
                          {productPost.productVariant}
                        </label>
                        <p className="mt-1 font-medium">{productPost.productVariantValue}</p>
                      </div>
                      <div></div>
                    </>
                  )}
                  {productPost.promotion && (
                    <>
                      <div>
                        <label className="text-muted-foreground text-xs font-medium tracking-wide">
                          Promotion
                        </label>
                        <p className="mt-1 font-medium">{productPost.promotion.label}</p>
                      </div>
                      <div></div>
                    </>
                  )}
                </div>
                <div className="border-t pt-2">
                  <label className="text-muted-foreground text-xs font-medium tracking-wide">
                    Warehouse
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Warehouse className="text-muted-foreground size-4" />
                    <span className="text-xs font-medium">{productPost.warehouse.name}</span>
                    <span className="text-muted-foreground text-xs">
                      • {productPost.warehouse.location}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Variants */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Product Variants</CardTitle>
                  <Button asChild size="sm">
                    <Link href={`/dashboard/products/${productPost.id}/swatches`}>Manage Variants</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {productPost.swatch && productPost.swatch.length === 0 ? (
                  <div className="py-8 text-center">
                    <PackageIcon className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
                    <p className="text-muted-foreground mb-2">No variants added yet</p>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/products/${productPost.id}/swatches`}>Add Variant</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {productPost.swatch?.map((swatchItem) => (
                      <Card
                        key={swatchItem.id}
                        className="group relative transition-shadow hover:shadow-md"
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{swatchItem.name}</h4>
                                <p className="text-muted-foreground mt-1 text-xs">
                                  {swatchItem.value}
                                </p>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {swatchItem.type}
                              </Badge>
                            </div>
                            {swatchItem.images && swatchItem.images.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {swatchItem.images.slice(0, 3).map((imgUrl, idx) => (
                                  <Image
                                    key={idx}
                                    src={imgUrl}
                                    alt={`${swatchItem.name} variant`}
                                    width={40}
                                    height={40}
                                    className="rounded border object-cover"
                                  />
                                ))}
                                {swatchItem.images.length > 3 && (
                                  <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded border text-xs">
                                    +{swatchItem.images.length - 3}
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Button asChild size="sm" variant="outline" className="flex-1">
                                <Link
                                  href={`/dashboard/products/${productPost.id}/swatches/${swatchItem.id}/update`}
                                >
                                  <EditIcon className="mr-1 h-3 w-3" />
                                  Edit
                                </Link>
                              </Button>
                              <Button asChild size="sm" variant="destructive">
                                <Link
                                  href={`/dashboard/products/${productPost.id}/swatches/${swatchItem.id}/delete`}
                                >
                                  <TrashIcon className="h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance & Reviews - Full Width */}
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Performance & Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="text-muted-foreground text-xs font-medium tracking-wide">
                    Rating
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(averageRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-xs">
                      ({productPost.reviews.length} reviews)
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium tracking-wide">
                    Created
                  </label>
                  <p className="mt-1 font-medium">{productPost.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium tracking-wide">
                    Updated
                  </label>
                  <p className="mt-1 font-medium">{productPost.updatedAt.toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-lg border p-4 text-center">
                  <Eye className="mx-auto mb-2" />
                  <div className="text-2xl font-bold">{interactionStats.views}</div>
                  <div className="text-xs font-medium">Views</div>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <Heart className="mx-auto mb-2" />
                  <div className="text-2xl font-bold">{favoritesCount}</div>
                  <div className="text-xs font-medium">Favorites</div>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <ShoppingBagIcon className="mx-auto mb-2" />
                  <div className="text-2xl font-bold">{interactionStats.addToCart}</div>
                  <div className="text-xs font-medium">Cart Adds</div>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <TrendingUp className="mx-auto mb-2" />
                  <div className="text-2xl font-bold">{interactionStats.total}</div>
                  <div className="text-xs font-medium">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Features */}
          {(isFeatured || productPost.promotion) && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {isFeatured && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Featured Product
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {productPost.featuredInBillboard.map((billboard) => (
                        <div key={billboard.id} className="flex items-center gap-2 rounded p-2">
                          <Award className="h-4 w-4" />
                          <span className="font-medium">{billboard.label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {productPost.promotion && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <TagIcon className="h-5 w-5" />
                      Active Promotion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold">{productPost.promotion.label}</h4>
                      <p className="">{productPost.promotion.description}</p>
                      <Badge
                        className={productPost.promotion.active ? 'bg-green-600' : 'bg-gray-600'}
                      >
                        {productPost.promotion.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Product Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="specifications">Specs</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <BlockNoteRender
                      initialContent={productPost.description || 'No description available'}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <BlockNoteRender
                      initialContent={productPost.features || 'No features listed'}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="specifications" className="mt-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <BlockNoteRender
                      initialContent={productPost.specifications || 'No specifications available'}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="content" className="mt-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <BlockNoteRender
                      initialContent={productPost.content || 'No additional content'}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  )
}

export default ProductIdRoutePage
