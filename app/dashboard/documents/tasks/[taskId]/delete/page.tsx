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

import { deleteTaskAction } from '@/server/actions/dashboard/task'

type Params = Promise<{ taskId: string }>

const DeleteTaskPage = async ({ params }: { params: Params }) => {
  noStore()
  const { taskId } = await params

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  })

  if (!task) {
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
            This action cannot be undone. This will permanently delete the following task:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">{task.title}</h3>
            <div className="text-center text-sm font-semibold">Status: {task.status}</div>
            <div className="text-center text-sm">Priority: {task.priority}</div>
            <div className="text-center text-sm">Label: {task.label}</div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/dashboard/documents/tasks`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              'use server'
              await deleteTaskAction(taskId)
              redirect('/dashboard/documents/tasks')
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default DeleteTaskPage
