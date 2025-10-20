'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { acceptInvitationAction, rejectInvitationAction } from '@/server/actions/dashboard/organization'

interface User {
  id: string
  name: string
  email: string
}

interface Invitation {
  id: string
  organizationId: string
  email: string
  role: string | null
  status: string
  expiresAt: Date
  inviterId: string
  user?: User | null
}

interface OrganizationInvitationsProps {
  invitations: Invitation[]
  currentUserId: string
}

const OrganizationInvitations = ({ invitations }: OrganizationInvitationsProps) => {
  const [isAccepting, setIsAccepting] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [invitationToActOn, setInvitationToActOn] = useState<string | null>(null)

  const handleAcceptInvitation = async (invitationId: string) => {
    setIsAccepting(true)
    setInvitationToActOn(invitationId)
    try {
      const result = await acceptInvitationAction(invitationId)
      if (result.status === 'success') {
        // You might want to add a toast notification here
        window.location.reload()
      } else {
        // Handle error
        toast.error(result.message)
      }
    } catch {
      toast.error('Failed to accept invitation')
    } finally {
      setIsAccepting(false)
      setInvitationToActOn(null)
    }
  }

  const handleRejectInvitation = async (invitationId: string) => {
    setIsRejecting(true)
    setInvitationToActOn(invitationId)
    try {
      const result = await rejectInvitationAction(invitationId)
      if (result.status === 'success') {
        // You might want to add a toast notification here
        window.location.reload()
      } else {
        // Handle error
        toast.error(result.message)
      }
    } catch {
      toast.error('Failed to reject invitation')
    } finally {
      setIsRejecting(false)
      setInvitationToActOn(null)
    }
  }

  // Filter invitations for the current user
  const userInvitations = invitations.filter(
    (invitation) => invitation.email === invitations.find((i) => i.id === invitation.id)?.email
  )

  if (userInvitations.length === 0) {
    return (
      <div className="rounded-md border p-6 text-center">
        <p className="text-muted-foreground">No pending invitations</p>
      </div>
    )
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization</TableHead>
            <TableHead>Invited By</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userInvitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>
                <div className="font-medium">Organization Name</div>
                <div className="text-muted-foreground text-sm">ID: {invitation.organizationId}</div>
              </TableCell>
              <TableCell>
                {invitation.user ? (
                  <div>
                    <div className="font-medium">{invitation.user.name}</div>
                    <div className="text-muted-foreground text-sm">{invitation.user.email}</div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">Unknown user</div>
                )}
              </TableCell>
              <TableCell>
                <span className="capitalize">{invitation.role || 'member'}</span>
              </TableCell>
              <TableCell>{format(new Date(invitation.expiresAt), 'MMM d, yyyy')}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptInvitation(invitation.id)}
                    disabled={isAccepting && invitationToActOn === invitation.id}
                  >
                    {isAccepting && invitationToActOn === invitation.id ? 'Accepting...' : 'Accept'}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInvitationToActOn(invitation.id)}
                      >
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will reject the invitation to join the organization. You can always
                          ask for another invitation later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            invitationToActOn && handleRejectInvitation(invitationToActOn)
                          }
                          disabled={isRejecting && invitationToActOn === invitation.id}
                        >
                          {isRejecting && invitationToActOn === invitation.id
                            ? 'Rejecting...'
                            : 'Reject'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default OrganizationInvitations
