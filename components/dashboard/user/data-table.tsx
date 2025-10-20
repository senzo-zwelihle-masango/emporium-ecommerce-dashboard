'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { FilePenIcon, MoreHorizontalIcon, Trash2Icon, ShieldBanIcon, EyeIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import BanUserModal from './ban-user'

import { deleteUserAction, unbanUserAction } from '@/server/actions/dashboard/manage'

import { Membership } from '@/lib/generated/prisma'

type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  phoneNumber: string | null
  role: string
  membership: Membership | null
  banned: boolean | null
  banReason: string | null
  banExpires: string | null
  membershipId: string | null
  points: number
  _count: {
    sessions: number
  }
  createdAt: string
  updatedAt: string
}

interface UsersTableProps {
  users: User[]
}

export default function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [, startTransition] = useTransition()

  const [banModalUserId, setBanModalUserId] = useState<string | null>(null)

  const handleUnban = (userId: string) => {
    startTransition(async () => {
      await unbanUserAction(userId)
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, banned: false } : u)))
    })
  }

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      await deleteUserAction(userId)
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    })
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Membership</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      className="rounded-full"
                      src={item.image ?? '/assets/placeholders/avatar-placeholder.png'}
                      unoptimized
                      width={30}
                      height={30}
                      alt={item.name}
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <span className="text-muted-foreground text-xs">{item.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={item.role === 'administrator' ? 'destructive' : 'secondary'}>
                    {item.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.membership?.title ?? 'No membership'}</Badge>
                </TableCell>
                <TableCell>
                  {item.banned ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge variant="default">Active</Badge>
                  )}
                </TableCell>
                <TableCell>{item._count.sessions}</TableCell>
                <TableCell>{format(new Date(item.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell>{format(new Date(item.updatedAt), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={'ghost'} className="h-8 w-8 p-0">
                        <MoreHorizontalIcon size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/users/${item.id}`}>
                          <EyeIcon className="size-4" /> View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/users/${item.id}/update`}>
                          <FilePenIcon className="size-4" /> Update
                        </Link>
                      </DropdownMenuItem>
                      {item.banned ? (
                        <DropdownMenuItem onClick={() => handleUnban(item.id)}>
                          <ShieldBanIcon className="size-4" /> Unban
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => setBanModalUserId(item.id)}>
                          <ShieldBanIcon className="size-4" /> Ban
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2Icon className="size-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {banModalUserId && (
        <BanUserModal
          userId={banModalUserId}
          onBanned={() =>
            setUsers((prev) =>
              prev.map((u) => (u.id === banModalUserId ? { ...u, banned: true } : u))
            )
          }
        />
      )}
    </>
  )
}
