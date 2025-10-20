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

import { deleteCollectionAction } from '@/server/actions/dashboard/collection'

type Params = Promise<{ collectionId: string }>

const DeleteCollectionPage = async ({ params }: { params: Params }) => {
  noStore()
  const { collectionId } = await params

  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    include: {
      category: true,
    },
  })

  if (!collection) {
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
            This action cannot be undone. This will permanently delete the following collection:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            {collection.image && (
              <Image
                src={collection.image}
                alt={`${collection.label} collection`}
                width={16}
                height={16}
                unoptimized
                className="h-16 w-16 object-contain"
              />
            )}
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">{collection.label}</h3>
            <p className="text-muted-foreground">{collection.description}</p>
            <div className="text-center text-sm font-semibold">
              Category: {collection.category.name}
            </div>
            {collection.color && (
              <div className="my-2 flex items-center justify-center space-x-2">
                <div
                  className="h-4 w-4 rounded-full border"
                  style={{ backgroundColor: collection.color }}
                />
                <span className="text-muted-foreground text-sm">{collection.color}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/dashboard/collections`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              'use server'
              await deleteCollectionAction(collectionId)
              redirect('/dashboard/collections')
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default DeleteCollectionPage
