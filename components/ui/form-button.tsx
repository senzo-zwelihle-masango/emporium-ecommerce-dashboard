'use client'

import React from 'react'
import { useFormStatus } from 'react-dom'
import { DeleteIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface buttonProps {
  text: string
}

export function DeleteButton({ text }: buttonProps) {
  const { pending } = useFormStatus()

  return (
    <>
      {pending ? (
        <Button disabled variant={'destructive'}>
          <Spinner /> Please Wait...
        </Button>
      ) : (
        <Button type="submit" variant={'destructive'}>
          <DeleteIcon />
          {text}
        </Button>
      )}
    </>
  )
}
