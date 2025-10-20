'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2Icon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { deleteOrganizationAction } from '@/server/actions/dashboard/organization'
import { tryCatch } from '@/hooks/use-try-catch'

type DeleteOrganizationButtonProps = {
  organizationId: string
}

export const DeleteOrganizationButton = ({ organizationId }: DeleteOrganizationButtonProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  // We'll use this state to manually control the dialog
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteOrganizationAction(organizationId))

      if (error) {
        toast.error('Unexpected error occurred. Please try again.')
      } else if (result.status === 'success') {
        toast.success(result.message)
        router.push('/dashboard/organization')
      } else if (result.status === 'error') {
        toast.error(result.message)
      }

      setOpen(false)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button variant="destructive" className="w-full sm:w-fit" onClick={() => setOpen(true)}>
        Delete
        <Trash2Icon className="mr-2 size-4" />
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your organization and remove
            all associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {isPending ? (
              <>
                Deleting...
                <Spinner />
              </>
            ) : (
              'Continue'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
