import React from 'react'
import Link from 'next/link'
import { PackageIcon } from 'lucide-react'
import { Product } from '@/types/dashboard/product'

import { Button } from '@/components/ui/button'
import ProductCard from './product-card'

interface ProductGridProps {
  products: Product[]
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted mb-4 rounded-full p-6">
          <PackageIcon className="text-muted-foreground h-12 w-12" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">No products found</h3>
        <p className="text-muted-foreground mb-4">Get started by creating your first product.</p>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
