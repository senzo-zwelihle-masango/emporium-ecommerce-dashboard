import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { auth } from '@/lib/auth'

import { Container } from '@/components/ui/container'

import { fetchAllProducts, fetchAllOrders, fetchAllUsers } from '@/app/api/dashboard/dashboard'
import ProfileCard from '@/components/account/profile-card'
import { CalendarWidget, TimeZoneWidget } from '@/components/dashboard/widgets/mini-widgets'
import TablesWidgets from '@/components/dashboard/widgets/tables'

const AdminPage = async () => {
  noStore()
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in')

  const [productsData, ordersData, usersData] = await Promise.all([
    fetchAllProducts(1, 5),
    fetchAllOrders(1, 5),
    fetchAllUsers(1, 5),
  ])

  const recentProducts = productsData.products
  const recentOrders = ordersData.orders
  const recentUsers = usersData.users
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="admin"
      className="my-4 space-y-8"
    >
      {/* header */}
      <ProfileCard
        name={
          session.user.name && session.user.name.length > 0
            ? session.user.name
            : session.user.email.split('@')[0]
        }
        email={session.user.email}
        emailVerified={session.user.emailVerified}
        image={session.user.image ?? `https://avatar.vercel.sh/${session.user.email}`}
        role={session.user.role ?? 'user'}
      />

      {/* Dashboard widgets */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CalendarWidget />
        <TimeZoneWidget />
      </div>

      {/* Recent Activity Tables */}
      <TablesWidgets products={recentProducts} orders={recentOrders} users={recentUsers} />
    </Container>
  )
}

export default AdminPage
