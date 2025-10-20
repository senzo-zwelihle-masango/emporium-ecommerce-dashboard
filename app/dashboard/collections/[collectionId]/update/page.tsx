import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma/client'

import { Container } from '@/components/ui/container'

import UpdateCollectionForm from '@/components/dashboard/forms/update/update-collection'

type Params = Promise<{ collectionId: string }>

async function fetchCollectionId(id: string) {
  noStore()
  const data = await prisma.collection.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      label: true,
      description: true,
      category: true,
      categoryId: true,
      color: true,
      image: true,
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

// New function to fetch all categories
async function fetchCategories() {
  noStore()
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  })

  return categories
}

const UpdateCollectionPage = async ({ params }: { params: Params }) => {
  noStore()
  const { collectionId } = await params

  // Fetch  collection  and all categories
  const [data, categories] = await Promise.all([fetchCollectionId(collectionId), fetchCategories()])

  return (
    <Container
      id="categories"
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-sm'}
      className="my-4"
    >
      <UpdateCollectionForm data={data} categories={categories} />
    </Container>
  )
}

export default UpdateCollectionPage
