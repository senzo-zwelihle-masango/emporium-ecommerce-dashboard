'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import { prisma } from '@/lib/prisma/client'

import { AccountOverviewData, AccountStats, RecentActivity } from '@/types/user/account/overview'

export async function fetchAccountOverview(): Promise<AccountOverviewData | null> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/signin')
  }

  try {
    // Fetch user with all related data
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        sessions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        membership: true,
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          include: {
            product: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        favorites: {
          include: {
            product: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        interactions: {
          include: {
            product: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!user) {
      return null
    }

    // Calculate statistics
    const totalOrders = user.orders.length
    const totalSpent = user.orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0)
    const totalReviews = user.reviews.length
    const totalFavorites = user.favorites.length
    const membershipLevel = user.membership?.title || null
    const joinedDate = user.createdAt
    const lastLoginDate = user.sessions[0]?.createdAt || null

    const stats: AccountStats = {
      totalOrders,
      totalSpent,
      totalReviews,
      totalFavorites,
      membershipLevel,
      joinedDate,
      lastLoginDate,
    }

    // Generate recent activities
    const recentActivities: RecentActivity[] = []

    // Add recent orders
    user.orders.slice(0, 3).forEach((order) => {
      recentActivities.push({
        type: 'order',
        id: order.id,
        title: `Order #${order.orderNumber}`,
        description: `${order.items.length} item(s) • $${Number(order.totalAmount)}`,
        date: order.createdAt,
        status: order.status,
        amount: Number(order.totalAmount),
      })
    })

    // Add recent reviews
    user.reviews.slice(0, 2).forEach((review) => {
      recentActivities.push({
        type: 'review',
        id: review.id,
        title: `Reviewed ${review.product.name}`,
        description: `${review.rating} stars`,
        date: review.createdAt,
      })
    })

    // Add recent favorites
    user.favorites.slice(0, 2).forEach((favorite) => {
      recentActivities.push({
        type: 'favorite',
        id: favorite.id,
        title: `Added to favorites`,
        description: favorite.product.name,
        date: favorite.createdAt,
      })
    })

    // Sort activities by date
    recentActivities.sort((a, b) => b.date.getTime() - a.date.getTime())

    // Get upcoming deliveries (orders that are shipped but not delivered)
    const upcomingDeliveries = user.orders
      .filter((order) => order.status === 'shipped' || order.status === 'processing')
      .slice(0, 3)
      .map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        estimatedDate: order.expectedDeliveryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
        status: order.status,
        items: order.items.length,
      }))

    // Get recommended products based on user interactions and favorites
    const interactedProductIds = user.interactions
      .filter((i) => i.product)
      .map((i) => i.product!.categoryId)
      .filter((id, index, arr) => arr.indexOf(id) === index) // Unique categories

    const recommendedProducts = await prisma.product.findMany({
      where: {
        categoryId: {
          in: interactedProductIds.slice(0, 3),
        },
        id: {
          notIn: user.favorites.map((f) => f.productId), // Exclude already favorited
        },
      },
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedRecommendations = recommendedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      image: product.images[0] || '/placeholder-product.jpg',
      price: Number(product.price),
      originalPrice: undefined, // No originalPrice field in schema
      rating: 5, // Default rating since no rating field exists
    }))

    return {
      stats,
      recentActivities: recentActivities.slice(0, 5), // Limit to 5 most recent
      upcomingDeliveries,
      recommendedProducts: formattedRecommendations,
    }
  } catch (error) {
    console.error('Error fetching account overview:', error)
    return null
  }
}
