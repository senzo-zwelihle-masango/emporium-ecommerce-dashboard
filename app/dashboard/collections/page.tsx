import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

import { fetchAllCollections } from '@/app/api/dashboard/collections'

import { columns } from '@/components/dashboard/collection/columns'
import { CollectionDataTable } from '@/components/dashboard/collection/data-table'

const CollectionsPage = async () => {
  noStore()
  const collections = await fetchAllCollections()
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
      <div className="mb-5 flex items-center justify-between">
        <Heading
          size={'5xl'}
          spacing={'normal'}
          lineHeight={'none'}
          weight={'bold'}
          margin={'none'}
        >
          Collections
        </Heading>

        <Button>
          <PlusIcon />
          <Link href={'/dashboard/collections/create'}>Create New</Link>
        </Button>
      </div>

      {/* main */}
      <CollectionDataTable columns={columns} data={collections} />
    </Container>
  )
}

export default CollectionsPage
