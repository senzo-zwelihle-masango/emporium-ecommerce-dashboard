import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import Image from 'next/image'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckIcon, PlusIcon, SparklesIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CrownIcon } from '@/components/icons/crown'

import { fetchAllMemberships } from '@/app/api/dashboard/membership'

const MembershipsPage = async () => {
  noStore()
  const memberships = await fetchAllMemberships()
  if (memberships.length === 0) {
    return (
      <Container
        size={'2xl'}
        alignment={'none'}
        height={'full'}
        padding={'px-sm'}
        gap={'none'}
        flow={'none'}
        id="memberships"
        className="my-4"
      >
        <div className="mb-8 flex items-center justify-between">
          <Heading
            size={'5xl'}
            spacing={'normal'}
            lineHeight={'none'}
            weight={'bold'}
            margin={'none'}
          >
            memberships
          </Heading>
        </div>

        <div className="border-muted-foreground/25 rounded-2xl border-2">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-muted mx-auto flex size-20 items-center justify-center rounded-full">
              <CrownIcon className="size-12" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No memberships yet</h3>
            <p className="text-muted-foreground mt-2 mb-4 text-sm">
              You haven&apos;t created any memberships yet. Get started
            </p>
            <Button>
              <Link href={'/dashboard/memberships/create'}>Create New</Link>
            </Button>
          </div>
        </div>
      </Container>
    )
  }
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="memberships"
      className="my-4 space-y-4"
    >
      {/* header */}
      <div className="mb-5 flex items-center justify-between">
        <Heading size={'5xl'} spacing={'normal'} lineHeight={'none'} margin={'none'}>
          Memberships
        </Heading>

        <Button>
          <PlusIcon />
          <Link href={'/dashboard/memberships/create'}>Create New</Link>
        </Button>
      </div>

      {/* data */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {memberships.map((membership) => (
          <Card key={membership.id} className="relative flex flex-col pt-12">
            {membership.popular && (
              <Badge className="absolute top-0 right-0 flex translate-x-1 -translate-y-1 items-center justify-center space-x-2 tabular-nums">
                Popular
                <SparklesIcon className="size-4" />
              </Badge>
            )}

            {/* Crown Image Container */}
            {membership.crown && (
              <div className="absolute inset-x-0 top-0 flex -translate-y-1/2 items-center justify-center">
                <Image
                  src={membership.crown}
                  alt={`${membership.title} crown`}
                  width={16}
                  height={16}
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="h-16 w-16 object-contain"
                />
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-center font-medium">{membership.title}</CardTitle>

              {/* Users count */}
              <div className="my-2 flex items-center justify-center space-x-2">
                <span className="text-xl font-semibold">{membership.users.length}</span>
                <span className="text-muted-foreground text-sm">
                  {membership.users.length === 1 ? 'User' : 'Users'}
                </span>
              </div>

              <div className="text-center text-sm font-semibold">
                {membership.minPoints} - {membership.maxPoints} Points
              </div>
              <CardDescription className="text-center text-sm">
                {membership.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <hr className="border-dashed" />
              <ul className="list-outside space-y-3 text-sm">
                {membership.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckIcon className="size-3" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="mt-auto grid grid-cols-2 gap-4 px-6 py-4">
              <Button asChild>
                <Link href={`/dashboard/memberships/${membership.id}/update`}>Edit</Link>
              </Button>
              <Button asChild variant={'destructive'}>
                <Link href={`/dashboard/memberships/${membership.id}/delete`}>Delete</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  )
}

export default MembershipsPage
