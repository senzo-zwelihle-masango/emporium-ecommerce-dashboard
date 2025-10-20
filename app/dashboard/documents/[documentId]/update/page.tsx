import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma/client'

import { Container } from '@/components/ui/container'

import UpdateDocumentForm from '@/components/dashboard/forms/update/update-document'

type Params = Promise<{ documentId: string }>

async function fetchDocumentId(id: string) {
  noStore()
  const data = await prisma.document.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      file: true,
      starred: true,
      status: true,
    },
  })

  if (!data) {
    return notFound()
  }

  return data
}

const UpdateDocumentPage = async ({ params }: { params: Params }) => {
  const { documentId } = await params
  const data = await fetchDocumentId(documentId)
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="update-document"
      className="my-4"
    >
      <UpdateDocumentForm document={data} />
    </Container>
  )
}

export default UpdateDocumentPage
