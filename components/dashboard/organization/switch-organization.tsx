'use client'

import * as React from 'react'
import { Plus, ChevronsUpDown } from 'lucide-react'
import { switchOrganizationAction } from '@/server/actions/dashboard/organization'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

interface Organization {
  id: string
  name: string
  slug?: string | null
  logo?: string | null
}

interface SwitchOrganizationDialogProps {
  organizations: Organization[]
  currentOrganizationId: string
}

export function SwitchOrganizationDialog({
  organizations,
  currentOrganizationId,
}: SwitchOrganizationDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isSwitching, setIsSwitching] = React.useState(false)

  const currentOrg =
    organizations.find((org) => org.id === currentOrganizationId) || organizations[0]

  const handleSwitch = async (org: Organization) => {
    if (org.id === currentOrg?.id) return
    setIsSwitching(true)
    try {
      const result = await switchOrganizationAction({
        organizationId: org.id,
      })
      if (result.status === 'success') {
        setOpen(false)
        window.location.reload()
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      toast.error('Failed to switch organization')
    } finally {
      setIsSwitching(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-[220px] justify-between">
          <div className="flex items-center gap-2 truncate">
            {currentOrg?.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentOrg.logo} alt={currentOrg.name} className="h-5 w-5 rounded" />
            ) : (
              <span className="text-xs font-bold">{currentOrg?.name[0]}</span>
            )}
            <span className="truncate">{currentOrg?.name}</span>
          </div>
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Switch organization</DialogTitle>
          <DialogDescription>Select an organization to switch into.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[300px] space-y-2">
          {organizations.map((org) => (
            <Button
              key={org.id}
              variant={org.id === currentOrg?.id ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
              disabled={isSwitching}
              onClick={() => handleSwitch(org)}
            >
              {org.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={org.logo} alt={org.name} className="h-5 w-5 rounded" />
              ) : (
                <span className="text-xs font-bold">{org.name[0]}</span>
              )}
              <div className="flex flex-col items-start">
                <span className="font-medium">{org.name}</span>
                {org.slug && <span className="text-muted-foreground text-xs">{org.slug}</span>}
              </div>
            </Button>
          ))}
          <Button variant="ghost" className="w-full justify-start gap-2" disabled={isSwitching}>
            <Plus className="h-4 w-4" />
            Add organization
          </Button>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
