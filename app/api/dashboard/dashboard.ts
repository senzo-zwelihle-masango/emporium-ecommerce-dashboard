import 'server-only'

import { prisma } from '@/lib/prisma/client'
import { OrderStatus, ReviewStatus } from '@/lib/generated/prisma'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'

export async function fetchDashboardStatistics() {
  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  const currentMonthEnd = endOfMonth(now)
  const lastMonthStart = startOfMonth(subMonths(now, 1))
  const lastMonthEnd = endOfMonth(subMonths(now, 1))

  const [
    totalUsers,
    totalOrders,
    totalProducts,
    totalRevenue,
    currentMonthUsers,
    lastMonthUsers,
    currentMonthOrders,
    lastMonthOrders,
    currentMonthRevenue,
    lastMonthRevenue,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: 'paid' },
    }),
    prisma.user.count({
      where: { createdAt: { gte: currentMonthStart, lte: currentMonthEnd } },
    }),
    prisma.user.count({
      where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
    }),
    prisma.order.count({
      where: { createdAt: { gte: currentMonthStart, lte: currentMonthEnd } },
    }),
    prisma.order.count({
      where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        paymentStatus: 'paid',
        createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
      },
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        paymentStatus: 'paid',
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
    }),
  ])

  const userGrowth =
    lastMonthUsers > 0 ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0

  const orderGrowth =
    lastMonthOrders > 0 ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 : 0

  const revenueGrowth =
    lastMonthRevenue._sum.totalAmount && currentMonthRevenue._sum.totalAmount
      ? ((Number(currentMonthRevenue._sum.totalAmount) -
          Number(lastMonthRevenue._sum.totalAmount)) /
          Number(lastMonthRevenue._sum.totalAmount)) *
        100
      : 0

  return {
    totalUsers,
    totalOrders,
    totalProducts,
    totalRevenue: Number(totalRevenue._sum.totalAmount) || 0,
    userGrowth,
    orderGrowth,
    revenueGrowth,
  }
}

export async function fetchMonthlyRevenue() {
  const now = new Date()
  const months = []

  for (let i = 11; i >= 0; i--) {
    const date = subMonths(now, i)
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)

    const revenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        paymentStatus: 'paid',
        createdAt: { gte: monthStart, lte: monthEnd },
      },
    })

    months.push({
      month: date.toLocaleDateString('en', { month: 'short' }),
      revenue: Number(revenue._sum.totalAmount) || 0,
    })
  }

  return months
}

export async function fetchOrderStatusDistribution() {
  const statusCounts = await prisma.order.groupBy({
    by: ['status'],
    _count: { status: true },
  })

  return statusCounts.map((item: { status: string; _count: { status: number } }) => ({
    status: item.status,
    count: item._count.status,
  }))
}

export async function fetchTopProducts() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      _count: true,
      name: true,
      price: true,
      orderItems: {
        select: {
          quantity: true,
        },
      },
    },
    orderBy: {
      orderItems: {
        _count: 'desc',
      },
    },
    take: 5,
  })

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    sales: product.orderItems.reduce((sum: number, item) => sum + item.quantity, 0),
  }))
}

export async function fetchRecentOrders() {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      orderNumber: true,
      totalAmount: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.user.name,
    customerEmail: order.user.email,
    amount: Number(order.totalAmount),
    status: order.status,
    date: order.createdAt,
  }))
}

export async function fetchCategoryPerformance() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      products: {
        select: {
          orderItems: {
            select: {
              quantity: true,
              price: true,
            },
          },
        },
      },
    },
  })

  return categories
    .map((category) => {
      const totalSales = category.products.reduce((categorySum, product) => {
        return (
          categorySum +
          product.orderItems.reduce((productSum, item) => {
            return productSum + item.quantity * Number(item.price)
          }, 0)
        )
      }, 0)

      return {
        name: category.name,
        sales: totalSales,
      }
    })
    .sort((a, b) => b.sales - a.sales)
}

export async function fetchAllUsers(page = 1, limit = 10, search = '') {
  const skip = (page - 1) * limit

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        points: true,
        banned: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ])

  return {
    users,
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function fetchAllOrders(page = 1, limit = 10, status?: string) {
  const skip = (page - 1) * limit

  const where = status ? { status: status as OrderStatus } : {}

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ])

  return {
    orders: orders.map((order) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    })),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function fetchAllProducts(page = 1, limit = 10, search = '') {
  const skip = (page - 1) * limit

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { sku: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        stock: true,
        status: true,
        tag: true,
        createdAt: true,
        brand: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        warehouse: {
          select: {
            name: true,
          },
        },
        _count: true,
        // _count removed because 'reviews' does not exist on Product
      },
    }),
    prisma.product.count({ where }),
  ])

  return {
    products: products.map((product) => ({
      ...product,
      price: Number(product.price),
    })),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function fetchAllCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      active: true,
      createdAt: true,
      // Replace 'products' with the correct relation name if it exists, or remove this block if not needed
      // _count: {
      //   products: true,
      // },
    },
  })

  return categories
}

export async function fetchAllBrands() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      _count: true,
      name: true,
      logo: true,
      active: true,
      products: true,
      promotions: true,
      createdAt: true,
    },
  })

  return brands
}

export async function fetchAllReviews(page = 1, limit = 10, status?: string) {
  const skip = (page - 1) * limit

  const where = status ? { status: status as ReviewStatus } : {}

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        rating: true,
        comment: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            name: true,
            images: true,
          },
        },
      },
    }),
    prisma.review.count({ where }),
  ])

  return {
    reviews,
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function fetchInventoryStatistics() {
  const [lowStockCount, outOfStockCount, totalProducts, averageStock, stockByWarehouse] =
    await Promise.all([
      prisma.product.count({
        where: {
          stock: { lt: 10, gt: 0 },
          status: 'active',
        },
      }),
      prisma.product.count({
        where: {
          stock: 0,
          status: 'active',
        },
      }),
      prisma.product.count({
        where: { status: 'active' },
      }),
      prisma.product.aggregate({
        _avg: { stock: true },
        where: { status: 'active' },
      }),
      prisma.warehouse.findMany({
        select: {
          name: true,
          _count: true,
        },
      }),
    ])

  return {
    lowStockCount,
    outOfStockCount,
    totalProducts,
    averageStock: Math.round(averageStock._avg.stock || 0),
    stockByWarehouse,
  }
}

export async function fetchCustomerInsights() {
  const now = new Date()
  const lastMonth = subMonths(now, 1)

  const [totalCustomers, newCustomersThisMonth, topCustomers, customersByRole] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { createdAt: { gte: lastMonth } },
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: { points: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        _count: true,
      },
    }),
    prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    }),
  ])

  return {
    totalCustomers,
    newCustomersThisMonth,
    topCustomers,
    customersByRole: customersByRole.map((item) => ({
      role: item.role,
      count: item._count.role,
    })),
  }
}

export async function fetchNotifications() {
  const notifications = await prisma.notification.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    where: { read: false },
    select: {
      id: true,
      message: true,
      type: true,
      createdAt: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  })

  return notifications
}

export async function fetchAllTasks() {
  const tasks = await prisma.task.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    where: {
      status: { in: ['todo', 'inprogress'] },
    },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      label: true,
      createdAt: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  })

  return tasks
}

export async function fetchAllDocuments(page = 1, limit = 10) {
  const skip = (page - 1) * limit

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        status: true,
        file: true,
        starred: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.document.count(),
  ])

  return {
    documents,
    total,
    totalPages: Math.ceil(total / limit),
  }
}
