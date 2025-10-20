import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'

import { Container } from '@/components/ui/container'

import { prisma } from '@/lib/prisma/client'

import CreateCollectionForm from '@/components/dashboard/forms/create/create-collection'

// fetch existing categories
async function getCategories() {
  noStore()
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
  return categories
}

const CreateCollectionPage = async () => {
  noStore()
  const categories = await getCategories()
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="create-category"
      className="my-4"
    >
      <CreateCollectionForm categories={categories} />
    </Container>
  )
}

export default CreateCollectionPage
