import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'

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

import { deleteDocumentAction } from '@/server/actions/dashboard/document'

type Params = Promise<{ documentId: string }>

const DeleteDocumentPage = async ({ params }: { params: Params }) => {
  noStore()
  const { documentId } = await params

  const document = await prisma.document.findUnique({
    where: { id: documentId },
  })

  if (!document) {
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
            This action cannot be undone. This will permanently delete the following document:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">{document.name}</h3>

            <div className="text-center text-sm">Status: {document.status}</div>
            {document.starred && (
              <div className="text-center text-sm text-yellow-600">⭐ Starred Document</div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/dashboard/documents`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              'use server'
              await deleteDocumentAction(documentId)
              redirect('/dashboard/documents')
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default DeleteDocumentPage
