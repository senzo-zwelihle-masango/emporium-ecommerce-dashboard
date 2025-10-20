import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

import { DataTable } from '@/components/dashboard/brand/data-table'
import { columns } from '@/components/dashboard/brand/columns'

import { fetchAllBrands } from '@/app/api/dashboard/brand'

const BrandsPage = async () => {
  noStore()
  const brands = await fetchAllBrands()
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
          Brands
        </Heading>

        <Button>
          <PlusIcon />
          <Link href={'/dashboard/brands/create'}>Create New</Link>
        </Button>
      </div>

      {/* main */}
      <DataTable data={brands} columns={columns} />
    </Container>
  )
}

export default BrandsPage
