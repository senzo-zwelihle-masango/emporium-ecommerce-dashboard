'use client'

import React from 'react'
import {
  AlertTriangleIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  FilterIcon,
  SearchIcon,
} from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  status: string
  tag: string
  createdAt: Date
  brand: { name: string }
  category: { name: string }
  warehouse: { name: string }
  _count: {
    orderItems: number
    reviews: number
  }
}

interface ProductsTableProps {
  products: Product[]
  total: number
  totalPages: number
  currentPage: number
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  archived: 'bg-red-100 text-red-800',
  comingsoon: 'bg-blue-100 text-blue-800',
  preorder: 'bg-purple-100 text-purple-800',
  limitedstock: 'bg-orange-100 text-orange-800',
  outofstock: 'bg-red-100 text-red-800',
}

const tagColors = {
  new: 'bg-green-100 text-green-800',
  newarrival: 'bg-blue-100 text-blue-800',
  bestseller: 'bg-purple-100 text-purple-800',
  featured: 'bg-indigo-100 text-indigo-800',
  limitedEdition: 'bg-orange-100 text-orange-800',
  exclusive: 'bg-pink-100 text-pink-800',
  clearance: 'bg-red-100 text-red-800',
  backinstock: 'bg-cyan-100 text-cyan-800',
  preorder: 'bg-yellow-100 text-yellow-800',
}

const ProductsTable = ({ products, total, totalPages, currentPage }: ProductsTableProps) => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Products Management</CardTitle>
            <CardDescription>Manage your product catalog and inventory</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <FilterIcon className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="outofstock">Out of Stock</SelectItem>
              <SelectItem value="limitedstock">Limited Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-muted-foreground text-sm">SKU: {product.sku}</div>
                      {product.tag && (
                        <Badge
                          variant="secondary"
                          className={`mt-1 ${tagColors[product.tag as keyof typeof tagColors]}`}
                        >
                          {product.tag.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.category.name}</div>
                      <div className="text-muted-foreground text-sm">{product.brand.name}</div>
                      <div className="text-muted-foreground text-xs">{product.warehouse.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">R{product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`${product.stock <= 0 ? 'text-red-600' : product.stock < 10 ? 'text-orange-600' : 'text-green-600'}`}
                      >
                        {product.stock}
                      </span>
                      {product.stock <= 0 && <AlertTriangleIcon className="h-4 w-4 text-red-500" />}
                      {product.stock > 0 && product.stock < 10 && (
                        <AlertTriangleIcon className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[product.status as keyof typeof statusColors]}>
                      {product.status.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{product._count.orderItems}</TableCell>
                  <TableCell>{product._count.reviews}</TableCell>
                  <TableCell>{format(new Date(product.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-muted-foreground text-sm">
            Showing {products.length} of {total} products
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductsTable
