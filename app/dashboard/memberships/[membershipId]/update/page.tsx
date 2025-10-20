import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma/client'

import { Container } from '@/components/ui/container'

import UpdateMembershipForm from '@/components/dashboard/forms/update/update-membership'

type Params = Promise<{ membershipId: string }>

async function fetchMembershipId(id: string) {
  noStore()
  const data = await prisma.membership.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      benefits: true,
      popular: true,
      minPoints: true,
      maxPoints: true,
      crown: true,
    },
  })

  if (!data) {
    return notFound()
  }

  return data
}

const Update = async ({ params }: { params: Params }) => {
  noStore()
  const { membershipId } = await params
  const data = await fetchMembershipId(membershipId)
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="update"
      className="my-4"
    >
      <UpdateMembershipForm data={data} />
    </Container>
  )
}

export default Update
