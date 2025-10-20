'use client'

import * as React from 'react'
import Link from 'next/link'

import {
  ArchiveIcon,
  CalendarIcon,
  CrownIcon,
  FlameIcon,
  GalleryThumbnailsIcon,
  GaugeIcon,
  HeartHandshakeIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LayoutListIcon,
  MapPinIcon,
  PackageOpenIcon,
  SettingsIcon,
  ShieldUserIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TablePropertiesIcon,
  TicketIcon,
  Trash2Icon,
  UsersRoundIcon,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import NavigationMain from '@/components/dashboard/layout/navigation-main'
import NavigationUser from '@/components/dashboard/layout/navigation-user'
import ElysianEmporiumLogo from '@/components/ui/emporium-ecommerce-svg'

// data

const data = {
  // placeholder
  user: {
    name: 'user',
    email: 'user@email.com',
    avatar: '/assets/placeholders/avatar-placeholder.png',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Analytics',
      url: '/dashboard/analytics',
      icon: GaugeIcon,
    },
    {
      title: 'Organization',
      url: '/dashboard/organization',
      icon: ShieldUserIcon,
    },
    {
      title: 'Orders',
      url: '/dashboard/orders',
      icon: ShoppingBagIcon,
    },
    {
      title: 'Products',
      url: '/dashboard/products',
      icon: PackageOpenIcon,
    },
    {
      title: 'Brands',
      url: '/dashboard/brands',
      icon: LayoutListIcon,
    },
    {
      title: 'Categories',
      url: '/dashboard/categories',
      icon: TablePropertiesIcon,
    },
    {
      title: 'Promotions',
      url: '/dashboard/promotions',
      icon: SparklesIcon,
    },
    {
      title: 'Billboards',
      url: '/dashboard/billboards',
      icon: GalleryThumbnailsIcon,
    },
    {
      title: 'Collections',
      url: '/dashboard/collections',
      icon: FlameIcon,
    },

    {
      title: 'Warehouses',
      url: '/dashboard/warehouses',
      icon: MapPinIcon,
    },
    {
      title: 'Documents',
      url: '/dashboard/documents',
      icon: LayersIcon,
    },
    {
      title: 'Events',
      url: '/dashboard/events',
      icon: CalendarIcon,
    },
    {
      title: 'Users',
      url: '/dashboard/users',
      icon: UsersRoundIcon,
    },
    {
      title: 'Tickets',
      url: '/dashboard/tickets',
      icon: TicketIcon,
    },
    {
      title: 'Memberships',
      url: '/dashboard/memberships',
      icon: CrownIcon,
    },

    {
      title: 'Feedback',
      url: '/dashboard/feedback',
      icon: HeartHandshakeIcon,
    },

    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: SettingsIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Trash',
      url: '/dashboard/trash',
      icon: Trash2Icon,
      isActive: true,
      items: [
        {
          title: 'Archives',
          url: '/dashboard/trash/archives',
        },
        {
          title: 'Deleted ',
          url: '/dashboard/trash/deleted',
        },
      ],
    },
  ],
}

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <ElysianEmporiumLogo className="size-8 rounded-sm" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Elysian Emporium</span>
                  <span className="truncate text-xs">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* search */}
      </SidebarHeader>
      {/* content */}
      <SidebarContent>
        <NavigationMain items={data.navMain} />
        {/* <NavigationSecondary items={data.navSecondary} /> */}
      </SidebarContent>
      {/* user */}
      <SidebarFooter>
        <NavigationUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
