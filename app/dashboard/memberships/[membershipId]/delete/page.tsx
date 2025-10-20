import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import Image from 'next/image'

import { prisma } from '@/lib/prisma/client'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { DeleteButton } from '@/components/ui/form-button'

import { deleteMembershipAction } from '@/server/actions/dashboard/membership'

type Params = Promise<{ membershipId: string }>

const DeleteMembershipPage = async ({ params }: { params: Params }) => {
  noStore()
  const { membershipId } = await params

  const membership = await prisma.membership.findUnique({
    where: { id: membershipId },
    include: {
      users: true,
    },
  })

  if (!membership) {
    return notFound()
  }

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="delete"
      className="my-4"
    >
      <Card className="bg-background mx-auto w-full max-w-lg">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the following membership:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            {membership.crown && (
              <Image
                src={membership.crown}
                alt={`${membership.title} crown`}
                width={16}
                height={16}
                unoptimized
                className="h-16 w-16 object-contain"
              />
            )}
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">{membership.title}</h3>
            <p className="text-muted-foreground">{membership.description}</p>
            <div className="my-2 flex items-center justify-center space-x-2">
              <span className="font-semibold">{membership.users.length}</span>
              <span className="text-muted-foreground text-sm">
                {membership.users.length === 1 ? 'User' : 'Users'}
              </span>
            </div>
            <div className="text-center text-sm font-semibold">
              {membership.minPoints} - {membership.maxPoints} Points
            </div>
          </div>
          <hr className="rounded-b-4xl border-dashed" />
          <h4 className="text-center font-medium">Benefits:</h4>
          <ul className="list-inside list-disc space-y-2 text-sm">
            {membership.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/dashboard/memberships`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              'use server'
              await deleteMembershipAction(membershipId)
              redirect('/dashboard/memberships')
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default DeleteMembershipPage
