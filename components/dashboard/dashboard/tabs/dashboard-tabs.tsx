'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MetricCards } from '@/components/dashboard/dashboard/cards/metric'
import RevenueChart from '@/components/dashboard/dashboard/charts/revenue'
import RecentOrdersCard from '@/components/dashboard/dashboard/cards/order'
import OrderChart from '@/components/dashboard/dashboard/charts/order'
import CategoryChart from '@/components/dashboard/dashboard/charts/category'
import ProductChart from '@/components/dashboard/dashboard/charts/product'
import OrdersTable from '@/components/dashboard/dashboard/tables/orders'
import ProductsTable from '@/components/dashboard/dashboard/tables/products'
import UsersTable from '@/components/dashboard/dashboard/tables/users'
import InventoryCards from '@/components/dashboard/dashboard/cards/inventory'

// Order interface to match the expected type
interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  status: string
  paymentStatus: string
  paymentMethod: string
  createdAt: Date
  itemCount: number
  user: {
    name: string
    email: string
  }
}

// Product interface for the products table
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

// User interface for the users table
interface UserData {
  id: string
  name: string
  email: string
  role: string
  points: number
  banned: boolean | null
  createdAt: Date
  _count?: {
    orders?: number
    reviews?: number
  }
}

interface DashboardData {
  stats: {
    totalUsers: number
    totalOrders: number
    totalProducts: number
    totalRevenue: number
    userGrowth: number
    orderGrowth: number
    revenueGrowth: number
  }
  monthlyRevenue: Array<{ month: string; revenue: number }>
  orderStatus: Array<{ status: string; count: number }>
  topProducts: Array<{
    id: string
    name: string
    price: number
    sales: number
  }>
  recentOrders: Array<{
    id: string
    orderNumber: string
    customerName: string
    customerEmail: string
    amount: number
    status: string
    date: Date
  }>
  categoryPerformance: Array<{ name: string; sales: number }>
  orders?: {
    orders: Order[]
    total: number
    totalPages: number
  }
  products?: {
    products: Product[]
    total: number
    totalPages: number
  }
  users?: {
    users: UserData[]
    total: number
    totalPages: number
  }
  inventoryStats?: {
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
}

interface DashboardTabsProps {
  data: DashboardData
}

const DashboardTabs = ({ data }: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="customers">Customers</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <MetricCards stats={data.stats} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <RevenueChart data={data.monthlyRevenue} />
          </div>
          <RecentOrdersCard orders={data.recentOrders} />
        </div>
      </TabsContent>

      <TabsContent value="orders" className="space-y-4">
        {data.orders ? (
          <OrdersTable
            orders={data.orders.orders}
            total={data.orders.total}
            totalPages={data.orders.totalPages}
            currentPage={1}
          />
        ) : (
          <div className="text-muted-foreground p-8 text-center">
            Orders data not available. Please refresh the page.
          </div>
        )}
      </TabsContent>

      <TabsContent value="products" className="space-y-4">
        {data.products ? (
          <ProductsTable
            products={data.products.products}
            total={data.products.total}
            totalPages={data.products.totalPages}
            currentPage={1}
          />
        ) : (
          <div className="text-muted-foreground p-8 text-center">
            Products data not available. Please refresh the page.
          </div>
        )}
      </TabsContent>

      <TabsContent value="customers" className="space-y-4">
        {data.users ? (
          <UsersTable
            users={data.users.users}
            total={data.users.total}
            totalPages={data.users.totalPages}
            currentPage={1}
          />
        ) : (
          <div className="text-muted-foreground p-8 text-center">
            Customer data not available. Please refresh the page.
          </div>
        )}
      </TabsContent>

      <TabsContent value="inventory" className="space-y-4">
        {data.inventoryStats ? (
          <>
            <InventoryCards stats={data.inventoryStats} />
            <div className="grid gap-4 md:grid-cols-2">
              <ProductChart data={data.topProducts} />
              <CategoryChart data={data.categoryPerformance} />
            </div>
          </>
        ) : (
          <div className="text-muted-foreground p-8 text-center">
            Inventory data not available. Please refresh the page.
          </div>
        )}
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <MetricCards stats={data.stats} />
        <div className="grid gap-4 md:grid-cols-2">
          <OrderChart data={data.orderStatus} />
          <CategoryChart data={data.categoryPerformance} />
        </div>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          <RevenueChart data={data.monthlyRevenue} />
          <ProductChart data={data.topProducts} />
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default DashboardTabs
