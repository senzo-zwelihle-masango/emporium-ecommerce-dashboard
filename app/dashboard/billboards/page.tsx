import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import Image from 'next/image'

import {
  FilePenIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  PlusIcon,
  GalleryHorizontalEndIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
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

import { fetchAllBillboards } from '@/app/api/dashboard/billboard'

const BillboardsPage = async () => {
  noStore()
  const billboards = await fetchAllBillboards()
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="tasks"
      className="my-4 space-y-4"
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <Heading
          size={'5xl'}
          spacing={'normal'}
          lineHeight={'none'}
          weight={'bold'}
          margin={'none'}
        >
          Billboards
        </Heading>

        <Button>
          <PlusIcon />
          <Link href={'/dashboard/billboards/create'}>Create New</Link>
        </Button>
      </div>

      {/* main */}
      <div>
        {billboards.length === 0 ? (
          <div className="my-40 flex flex-col items-center justify-center">
            <Heading size={'sm'} spacing={'normal'} lineHeight={'none'} margin={'md'}>
              No Billboards Found!
            </Heading>
            <GalleryHorizontalEndIcon size={80} />
          </div>
        ) : (
          <div className="mx-auto mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {billboards.map((billboard) => (
              <div
                key={billboard.id}
                className="group bg-background text-card-foreground relative cursor-pointer gap-0 overflow-hidden rounded-2xl border py-0 shadow-md transition-all hover:shadow-md"
              >
                <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden">
                  <Image
                    src={billboard.image || '/placeholder.svg'}
                    alt={billboard.label}
                    width={400}
                    height={300}
                    quality={95}
                    className="rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* <Badge className="absolute left-2 top-2 text-white">
                    {billboard.category}
                  </Badge> */}
                </div>
                <div className="p-2 sm:p-3">
                  <h3 className="truncate text-xl font-bold">{billboard.label}</h3>
                  {billboard.description && (
                    <p className="text-muted-foreground mt-1 truncate text-xs">
                      {billboard.description}
                    </p>
                  )}

                  <p className="text-muted-foreground mt-1 truncate text-xs">
                    {new Intl.DateTimeFormat('en-US').format(billboard.createdAt)}
                  </p>

                  <div className="mt-2 flex items-center justify-end space-x-4">
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
                          <Link href={`/dashboard/billboards/${billboard.id}/update`}>Update</Link>
                          <FilePenIcon className="ml-1 size-4" />
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          <Link href={`/dashboard/billboards/${billboard.id}/delete`}>Delete</Link>

                          <Trash2Icon className="ml-2 size-4" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

export default BillboardsPage
