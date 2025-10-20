import React from 'react'
import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'

import { prisma } from '@/lib/prisma/client'

import { Container } from '@/components/ui/container'

import UpdateBrandForm from '@/components/dashboard/forms/update/update-brand'

type Params = Promise<{ brandId: string }>

async function getBrandId(id: string) {
  noStore()
  const data = await prisma.brand.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      logo: true,
      active: true,
    },
  })

  if (!data) {
    return notFound()
  }

  return data
}

const UpdateBrandPage = async ({ params }: { params: Params }) => {
  noStore()
  const { brandId } = await params
  const data = await getBrandId(brandId)
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="update-brand"
      className="my-4"
    >
      <UpdateBrandForm brand={data} />
    </Container>
  )
}

export default UpdateBrandPage
