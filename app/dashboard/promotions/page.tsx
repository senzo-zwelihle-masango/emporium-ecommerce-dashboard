import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import Image from 'next/image'

import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontalIcon,
  FilePenIcon,
  Trash2Icon,
  GalleryHorizontalEndIcon,
  PlusIcon,
} from 'lucide-react'

import { fetchAllPromotions } from '@/app/api/dashboard/promotion'

const PromotionsPage = async () => {
  noStore()
  const promotions = await fetchAllPromotions()

  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      id="promotions"
      className="my-4 space-y-4"
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <Heading
          size={'5xl'}
          spacing={'normal'}
          lineHeight={'none'}
          weight={'bold'}
          margin={'none'}
        >
          Promotions
        </Heading>

        <Button>
          <PlusIcon />
          <Link href="/dashboard/promotions/create">Create New</Link>
        </Button>
      </div>

      {/* Main */}
      <div>
        {promotions.length === 0 ? (
          <div className="my-40 flex flex-col items-center justify-center">
            <Heading size={'lg'} spacing={'normal'} lineHeight={'none'} margin={'md'}>
              No Promotions Found!
            </Heading>
            <GalleryHorizontalEndIcon size={80} />
          </div>
        ) : (
          <div className="mx-auto mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="group bg-background text-card-foreground relative cursor-pointer gap-0 overflow-hidden rounded-2xl border py-0 shadow-md transition-all hover:shadow-md"
              >
                <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden">
                  <Image
                    src={promo.image || '/placeholder.svg'}
                    alt={promo.label}
                    width={400}
                    height={300}
                    quality={95}
                    className="rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-2 sm:p-3">
                  <h3 className="truncate text-xl font-bold">{promo.label}</h3>
                  {promo.description && (
                    <p className="text-muted-foreground mt-1 truncate text-xs">
                      {promo.description}
                    </p>
                  )}
                  <p className="text-muted-foreground mt-1 truncate text-xs">
                    {new Intl.DateTimeFormat('en-US').format(promo.createdAt)}
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
                          <Link href={`/dashboard/promotions/${promo.id}/update`}>Update</Link>
                          <FilePenIcon className="ml-1 size-4" />
                        </DropdownMenuItem>

                        <DropdownMenuItem variant="destructive">
                          <Link href={`/dashboard/promotions/${promo.id}/delete`}>Delete</Link>
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

export default PromotionsPage
