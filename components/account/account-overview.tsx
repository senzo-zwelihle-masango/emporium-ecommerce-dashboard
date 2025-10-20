'use client'

import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  BellIcon,
  CreditCardIcon,
  HeartIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  SettingsIcon,
  ShoppingBagIcon,
  StarIcon,
} from 'lucide-react'

import { OverviewTab } from './overview'
import { OrdersTab } from './order'
import { FavoritesTab } from './favorite'
import { NotificationsTab } from './notification'
import { ShippingTabWrapper } from './shipping'
import { PaymentTab } from './empty'
import { SettingsTab } from './settings/settings-tab'
import { ReviewsTab } from './review'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'

import { UserAccountData } from '@/types/user/account/data'
import { AccountOverviewData } from '@/types/user/account/overview'

interface AccountOverviewProps {
  userData: UserAccountData
  overviewData: AccountOverviewData
}

const AccountOverview = ({ userData, overviewData }: AccountOverviewProps) => {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboardIcon,
      component: <OverviewTab data={overviewData} />,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBagIcon,
      count: userData.orders?.length || 0,
      component: <OrdersTab orders={userData.orders || []} />,
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: StarIcon,
      count: userData.reviews?.length || 0,
      component: <ReviewsTab reviews={userData.reviews || []} />,
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: HeartIcon,
      count: userData.favorites?.length || 0,
      component: <FavoritesTab favorites={userData.favorites || []} />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: BellIcon,
      count: userData.notifications?.filter((n) => !n.read).length || 0,
      component: <NotificationsTab notifications={userData.notifications || []} />,
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: MapPinIcon,
      count: userData.shipping?.length || 0,
      component: <ShippingTabWrapper addresses={userData.shipping || []} />,
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: CreditCardIcon,
      component: <PaymentTab />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      component: (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button asChild>
              <Link href="/settings">View Full Settings</Link>
            </Button>
          </div>
          <SettingsTab />
        </div>
      ),
    },
  ]
  return (
    <Tabs defaultValue="overview" className="w-full">
      {/* Tab Navigation */}
      <div className="w-full">
        <div className="lg:hidden">
          {/* Mobile: Horizontal scrolling tabs */}
          <div
            className="overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <TabsList className="inline-flex h-auto w-max gap-1 p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="data-[state=active]:bg-background flex h-12 min-w-fit items-center justify-center gap-2 px-4 py-2 text-xs font-medium whitespace-nowrap transition-all data-[state=active]:shadow-sm"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                        {tab.count > 99 ? '99+' : tab.count}
                      </Badge>
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>
        </div>

        <div className="hidden lg:block">
          {/* Desktop: Grid layout */}
          <TabsList className="grid h-auto w-full grid-cols-8 p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-background flex h-12 items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all data-[state=active]:shadow-sm"
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 py-0.5 text-xs">
                      {tab.count > 99 ? '99+' : tab.count}
                    </Badge>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative mt-6">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="ring-offset-background focus-visible:ring-ring mt-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                <Card className="border-0 bg-transparent p-0 shadow-none">{tab.component}</Card>
              </motion.div>
            </TabsContent>
          ))}
        </AnimatePresence>
      </div>
    </Tabs>
  )
}

export default AccountOverview
