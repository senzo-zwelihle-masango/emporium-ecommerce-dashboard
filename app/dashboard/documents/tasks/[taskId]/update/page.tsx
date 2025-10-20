import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma/client'

import { Container } from '@/components/ui/container'

import UpdateTaskForm from '@/components/dashboard/forms/update/update-task'

type Params = Promise<{ taskId: string }>

async function fetchTaskId(id: string) {
  noStore()
  const data = await prisma.task.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      label: true,
      status: true,
      priority: true,
    },
  })

  if (!data) {
    return notFound()
  }

  return data
}

const UpdateTaskPage = async ({ params }: { params: Params }) => {
  noStore()
  const { taskId } = await params
  const data = await fetchTaskId(taskId)
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
      <UpdateTaskForm task={data} />
    </Container>
  )
}

export default UpdateTaskPage
