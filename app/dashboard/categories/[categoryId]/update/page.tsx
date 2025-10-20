import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma/client'

import { Container } from '@/components/ui/container'

import UpdateCategoryForm from '@/components/dashboard/forms/update/update-category'

type Params = Promise<{ categoryId: string }>

async function fetchCategoryId(id: string) {
  noStore()
  const data = await prisma.category.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!data) {
    return notFound()
  }

  return data
}

const UpdateCategoryPage = async ({ params }: { params: Params }) => {
  noStore()
  const { categoryId } = await params
  const data = await fetchCategoryId(categoryId)
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="update-category"
      className="my-4"
    >
      <UpdateCategoryForm category={data} />
    </Container>
  )
}

export default UpdateCategoryPage
