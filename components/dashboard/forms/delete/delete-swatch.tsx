'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { TrashIcon } from 'lucide-react'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

import { tryCatch } from '@/hooks/use-try-catch'

import { deleteSwatchAction } from '@/server/actions/dashboard/swatch'

interface DeleteSwatchFormProps {
  swatchId: string
  productId: string
}

const DeleteSwatchForm = ({ swatchId, productId }: DeleteSwatchFormProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteSwatchAction(swatchId))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        router.push(`/dashboard/products/${productId}/swatches`)
      } else if (result.status === 'error') {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="flex gap-4">
      <Button variant="outline" onClick={() => router.back()} disabled={isPending}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
        {isPending ? (
          <>
            <Spinner />
            Deleting...
          </>
        ) : (
          <>
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete Swatch
          </>
        )}
      </Button>
    </div>
  )
}

export default DeleteSwatchForm
