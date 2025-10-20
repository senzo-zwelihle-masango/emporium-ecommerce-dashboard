import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma/client'

import { Container } from '@/components/ui/container'
import UpdateNoteForm from '@/components/dashboard/forms/update/update-note'

type Params = Promise<{ noteId: string }>

async function fetchNoteId(id: string) {
  noStore()
  const data = await prisma.note.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      tag: true,
      status: true,
      action: true,
      published: true,
    },
  })

  if (!data) {
    return notFound()
  }

  return data
}

const UpdateNotePage = async ({ params }: { params: Params }) => {
  const { noteId } = await params
  const data = await fetchNoteId(noteId)
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="update-note"
      className="my-4"
    >
      <UpdateNoteForm note={data} />
    </Container>
  )
}

export default UpdateNotePage
