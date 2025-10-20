import React from 'react'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { toast } from 'sonner'

import { auth } from '@/lib/auth'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import DashboardTabs from '@/components/dashboard/dashboard/tabs/dashboard-tabs'

import {
  fetchDashboardStatistics,
  fetchMonthlyRevenue,
  fetchOrderStatusDistribution,
  fetchTopProducts,
  fetchRecentOrders,
  fetchCategoryPerformance,
  fetchAllUsers,
  fetchAllOrders,
  fetchAllProducts,
  fetchInventoryStatistics,
} from '@/app/api/dashboard/dashboard'

const AnalyticsPage = async () => {
  noStore()
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) redirect('/sign-in')

  try {
    const [stats, monthlyRevenue, orderStatus, topProducts, recentOrders, categoryPerformance] =
      await Promise.all([
        fetchDashboardStatistics(),
        fetchMonthlyRevenue(),
        fetchOrderStatusDistribution(),
        fetchTopProducts(),
        fetchRecentOrders(),
        fetchCategoryPerformance(),
      ])

    // Try to fetch additional data with error handling
    let users, orders, products, inventoryStats

    try {
      users = await fetchAllUsers(1, 20)
    } catch (error) {
      toast.error(`Error fetching users: ${error instanceof Error ? error.message : String(error)}`)
      users = { users: [], total: 0, totalPages: 0 }
    }

    try {
      orders = await fetchAllOrders(1, 20)
    } catch (error) {
      toast.error(
        `Error fetching orders: ${error instanceof Error ? error.message : String(error)}`
      )
      orders = { orders: [], total: 0, totalPages: 0 }
    }

    try {
      products = await fetchAllProducts(1, 20)
    } catch (error) {
      toast.error(
        `Error fetching products: ${error instanceof Error ? error.message : String(error)}`
      )
      products = { products: [], total: 0, totalPages: 0 }
    }

    try {
      inventoryStats = await fetchInventoryStatistics()
    } catch (error) {
      toast.error(
        `Error fetching Inventory: ${error instanceof Error ? error.message : String(error)}`
      )
      inventoryStats = {
        lowStockCount: 0,
        outOfStockCount: 0,
        totalProducts: 0,
        averageStock: 0,
        stockByWarehouse: [{ name: '', _count: { products: 0 } }],
      }
    }

    const dashboardData = {
      stats,
      monthlyRevenue,
      orderStatus,
      topProducts,
      recentOrders,
      categoryPerformance,
      users,
      orders,
      products,
      inventoryStats,
    }

    return (
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <Heading size={'5xl'} spacing={'normal'} lineHeight={'none'} margin={'none'}>
            Analytics
          </Heading>
        </div>
        <DashboardTabs data={dashboardData} />
      </div>
    )
  } catch (error) {
    toast.error(`Dashboard error: ${error instanceof Error ? error.message : String(error)}`)

    // Return fallback UI in case of major errors
    return (
      <Container
        size={'2xl'}
        alignment={'none'}
        height={'screen'}
        padding={'px-md'}
        gap={'none'}
        flow={'none'}
        id="analytics"
      >
        <Heading
          size={'5xl'}
          spacing={'normal'}
          lineHeight={'none'}
          weight={'bold'}
          margin={'none'}
        >
          Analytics - Error Loading Data
        </Heading>
      </Container>
    )
  }
}

export default AnalyticsPage
