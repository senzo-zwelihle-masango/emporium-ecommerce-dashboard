import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'

import { Container } from '@/components/ui/container'
import UpdateUserForm from '@/components/dashboard/user/update-user'

import { prisma } from '@/lib/prisma/client'

type Params = Promise<{ id: string }>

async function getUserById(id: string) {
  noStore()
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phoneNumber: true,
      image: true,
    },
  })

  if (!user) {
    return notFound()
  }

  return user
}

const UpdateUserPage = async ({ params }: { params: Params }) => {
  const { id } = await params
  const user = await getUserById(id)

  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      id="update-user"
      className="my-4"
    >
      <UpdateUserForm
        user={{
          ...user,
          image:
            user.image ??
            'https://rfqaz4vzed.ufs.sh/f/SXxECvrOztbAGAOTiF0yxnS3OPIhykqsbaQtAmZJTMoc7Rir',
        }}
      />
    </Container>
  )
}

export default UpdateUserPage
