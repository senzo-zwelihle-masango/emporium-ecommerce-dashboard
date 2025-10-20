'use client'

import { useState } from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { updateMemberRoleAction, removeMemberAction } from '@/server/actions/dashboard/organization'
import Image from 'next/image'

interface User {
  id: string
  name: string
  email: string
  image?: string | null
}

interface MemberWithUser {
  id: string
  organizationId: string
  userId: string
  role: string
  createdAt: Date
  user: User
}

interface ManageMembersProps {
  members: MemberWithUser[]
  organizationId: string
  currentUserId: string
}

const ManageMembers = ({ members, organizationId, currentUserId }: ManageMembersProps) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null)

  const handleRoleChange = async (memberId: string, newRole: string) => {
    setIsUpdating(true)
    try {
      const result = await updateMemberRoleAction(organizationId, {
        memberId,
        role: newRole,
      })
      if (result.status === 'success') {
        window.location.reload()
      } else {
        // Handle error
        toast.error(result.message)
      }
    } catch {
      toast.error('Failed to update member role')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    setIsRemoving(true)
    try {
      const result = await removeMemberAction(organizationId, { memberId })
      if (result.status === 'success') {
        window.location.reload()
      } else {
        // Handle error
        toast.error(result.message)
      }
    } catch {
      toast.error('Failed to remove member, please try again.')
    } finally {
      setIsRemoving(false)
      setMemberToRemove(null)
    }
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  {member.user.image && (
                    <Image
                      src={member.user.image}
                      alt={member.user.name}
                      width={40}
                      height={40}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium">{member.user.name}</div>
                    <div className="text-muted-foreground text-sm">{member.user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {member.userId === currentUserId ? (
                  <span className="capitalize">{member.role}</span>
                ) : (
                  <Select
                    value={member.role}
                    onValueChange={(value) => handleRoleChange(member.id, value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
              <TableCell>
                {member.userId !== currentUserId && member.role !== 'owner' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setMemberToRemove(member.id)}
                      >
                        Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently remove the member from
                          the organization.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => memberToRemove && handleRemoveMember(memberToRemove)}
                          disabled={isRemoving}
                        >
                          {isRemoving ? 'Removing...' : 'Remove'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ManageMembers
