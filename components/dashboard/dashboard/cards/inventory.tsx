import React from 'react'
import { AlertTriangleIcon, PackageIcon, TrendingDownIcon, WarehouseIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InventoryStatistics {
  lowStockCount: number
  outOfStockCount: number
  totalProducts: number
  averageStock: number
  stockByWarehouse: Array<{
    name: string
    _count: {
      products: number
    }
  }>
}

interface InventoryCardsProps {
  stats: InventoryStatistics
}

const InventoryCards = ({ stats }: InventoryCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <AlertTriangleIcon className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.lowStockCount}</div>
          <p className="text-muted-foreground text-xs">Items with less than 10 in stock</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          <TrendingDownIcon className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.outOfStockCount}</div>
          <p className="text-muted-foreground text-xs">Items completely out of stock</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <PackageIcon className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-muted-foreground text-xs">Active products in catalog</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Stock</CardTitle>
          <WarehouseIcon className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageStock}</div>
          <p className="text-muted-foreground text-xs">Average units per product</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default InventoryCards
