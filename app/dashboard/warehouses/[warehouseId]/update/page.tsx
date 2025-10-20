import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma/client'

import { Container } from '@/components/ui/container'

import UpdateWarehouseForm from '@/components/dashboard/forms/update/update-warehouse'

type Params = Promise<{ warehouseId: string }>

async function fetchWarehouseId(id: string) {
  noStore()
  const data = await prisma.warehouse.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      location: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!data) {
    return notFound()
  }

  return data
}

const UpdateWarehousePage = async ({ params }: { params: Params }) => {
  noStore()
  const { warehouseId } = await params
  const data = await fetchWarehouseId(warehouseId)
  return (
    <Container
      id="warehouses"
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      className="my-4"
    >
      <UpdateWarehouseForm data={data} />
    </Container>
  )
}

export default UpdateWarehousePage
