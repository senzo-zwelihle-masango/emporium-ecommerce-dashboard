'use client'

import React, { useTransition } from 'react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

import { tryCatch } from '@/hooks/use-try-catch'

import { updateMaintenanceModeAction } from '@/server/actions/dashboard/maintenance'

interface MaintenanceModeToggleProps {
  initialEnabled?: boolean
}

export const MaintenanceModeToggle = ({ initialEnabled = false }: MaintenanceModeToggleProps) => {
  const [isPending, startTransition] = useTransition()

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateMaintenanceModeAction({
          enabled: checked,
          message: 'We are currently performing scheduled maintenance. Please check back soon.',
        })
      )

      if (error) {
        toast.error('Failed to update maintenance mode')
        return
      }

      if (result.status === 'success') {
        toast.success(`Maintenance mode ${checked ? 'enabled' : 'disabled'}`)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Switch defaultChecked={initialEnabled} disabled={isPending} onCheckedChange={handleToggle} />
  )
}
