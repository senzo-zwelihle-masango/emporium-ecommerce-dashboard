import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { BoxesIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'

import ProductGrid from '@/components/dashboard/product/product-grid'

import { fetchAllProducts } from '@/app/api/dashboard/product'

import { serializeProducts } from '@/types/dashboard/product'

const ProductsPage = async () => {
  noStore()
  const rawProducts = await fetchAllProducts()
  const products = serializeProducts(rawProducts)
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="tasks"
      className="my-4 space-y-4"
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <Heading
          size={'5xl'}
          spacing={'normal'}
          lineHeight={'none'}
          weight={'bold'}
          margin={'none'}
        >
          Products
        </Heading>

        <Button>
          <PlusIcon />
          <Link href={'/dashboard/products/create'}>Create New</Link>
        </Button>
      </div>

      {/* main */}
      {products.length === 0 ? (
        <div className="my-40 flex flex-col items-center justify-center">
          <Heading size={'sm'} spacing={'normal'} lineHeight={'none'} margin={'md'}>
            No Products Found!...
          </Heading>
          <BoxesIcon size={80} />
        </div>
      ) : (
        <div>
          {/* Stats Cards */}
          <div className="my-6 mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {products.filter((p) => p.status === 'active').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {products.filter((p) => p.stock < 10).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <ProductGrid products={products} />
        </div>
      )}
    </Container>
  )
}

export default ProductsPage
