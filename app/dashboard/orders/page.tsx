import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { DataTable } from '@/components/dashboard/order/data-table'
import { columns } from '@/components/dashboard/order/columns'

import { fetchAllOrders } from '@/app/api/dashboard/order'

async function getData() {
  noStore()
  const data = await fetchAllOrders()
  return data
}

const OrdersPage = async () => {
  const orders = await getData()
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="orders"
      className="my-4"
    >
      {/* header */}
      <div className="mb-5 space-y-6">
        <div>
          <Heading
            size={'5xl'}
            spacing={'normal'}
            lineHeight={'none'}
            weight={'bold'}
            margin={'none'}
          >
            Orders
          </Heading>
          <p className="text-muted-foreground">Manage and view all customer orders</p>
        </div>

        {/* main */}
        <Separator />
        <DataTable data={orders} columns={columns} />
      </div>
    </Container>
  )
}

export default OrdersPage
