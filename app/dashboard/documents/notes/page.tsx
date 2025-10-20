import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import {
  CalendarDaysIcon,
  ClockIcon,
  EyeIcon,
  FilePenIcon,
  FilePenLineIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TagIcon,
  Trash2Icon,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/ui/container'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { fetchAllNotes } from '@/app/api/dashboard/note'

const NotesPage = async () => {
  noStore()
  const notes = await fetchAllNotes()
  if (notes.length === 0) {
    return (
      <Container
        size={'2xl'}
        alignment={'center'}
        height={'full'}
        padding={'px-sm'}
        gap={'none'}
        flow={'col'}
        className="space-y-6 pt-28"
      >
        <Heading
          size={'5xl'}
          spacing={'normal'}
          lineHeight={'none'}
          weight={'bold'}
          margin={'none'}
        >
          No Notes
        </Heading>
        <p>You haven&apos;t created any notes yet. Get started by creating your first note.</p>
        <FilePenLineIcon size={80} />

        <Button>
          {' '}
          <PlusIcon />
          <Link href={'/dashboard/documents/notes/create'}>Create Note</Link>
        </Button>
      </Container>
    )
  }

  const setUserInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="notes"
      className="my-4"
    >
      {/* header */}
      <div className="mb-5 flex items-center justify-between">
        <Heading
          size={'5xl'}
          spacing={'normal'}
          lineHeight={'none'}
          weight={'bold'}
          margin={'none'}
        >
          Notes
        </Heading>

        <Button>
          <PlusIcon />
          <Link href={'/dashboard/documents/notes/create'}>Create Note</Link>
        </Button>
      </div>

      {/* main */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card
            key={note.id}
            className="group transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {setUserInitials(note.user?.name || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">
                      {note.user?.name || 'Unknown'}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                      <div className="flex w-full items-center justify-between">
                        <Link href={`/dashboard/documents/notes/${note.id}`}>View</Link>
                        <EyeIcon className="size-4" />
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <div className="flex w-full items-center justify-between">
                        <Link href={`/dashboard/documents/notes/${note.id}/update`}>Edit</Link>
                        <FilePenIcon className="size-4" />
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem variant="destructive">
                      <div className="flex w-full items-center justify-between">
                        <Link href={`/dashboard/documents/notes/${note.id}/delete`}>Delete</Link>
                        <Trash2Icon className="size-4" />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <CardTitle className="line-clamp-2 text-lg leading-tight">
                  {note.title || 'Untitled Note'}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-4 flex flex-wrap gap-2">
                {note.status && <Badge variant="outline">{note.status}</Badge>}
                {note.tag && (
                  <Badge variant="secondary" className="text-xs">
                    <TagIcon className="mr-1 h-3 w-3" />
                    {note.tag}
                  </Badge>
                )}
                {note.published && (
                  <Badge variant="default" className="text-xs">
                    Published
                  </Badge>
                )}
              </div>

              <Separator className="mb-4" />

              <div className="text-muted-foreground space-y-2 text-xs">
                <div className="flex items-center">
                  <CalendarDaysIcon className="mr-2 h-3 w-3" />
                  Created{' '}
                  {formatDistanceToNow(new Date(note.createdAt), {
                    addSuffix: true,
                  })}
                </div>
                {note.updatedAt && note.updatedAt !== note.createdAt && (
                  <div className="flex items-center">
                    <ClockIcon className="mr-2 h-3 w-3" />
                    Updated{' '}
                    {formatDistanceToNow(new Date(note.updatedAt), {
                      addSuffix: true,
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  )
}

export default NotesPage
