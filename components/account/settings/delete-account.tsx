'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AlertTriangleIcon, TrashIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { tryCatch } from '@/hooks/use-try-catch'

import { deleteAccountAction } from '@/server/actions/user/delete-account'

interface DeleteAccountSectionProps {
  userId: string
}

export const DeleteAccountSection = ({ userId }: DeleteAccountSectionProps) => {
  const [isPending, startTransition] = useTransition()
  const [confirmEmail, setConfirmEmail] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const router = useRouter()

  const handleDeleteAccount = async () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteAccountAction({ userId }))

      if (error) {
        toast.error('Unexpected error occurred. Please try again.')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        router.push('/auth/sign-in')
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <AlertTriangleIcon className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>Permanently delete your account and all associated data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            This action is irreversible. All your data including orders, reviews, favorites, and
            personal information will be permanently deleted.
          </AlertDescription>
        </Alert>

        {showConfirmation ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirm-email">Type your email to confirm deletion</Label>
              <Input
                id="confirm-email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isPending || confirmEmail.trim() === ''}
              >
                {isPending ? 'Deleting...' : 'Permanently Delete Account'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmation(false)
                  setConfirmEmail('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="destructive"
            onClick={() => setShowConfirmation(true)}
            className="w-full"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
