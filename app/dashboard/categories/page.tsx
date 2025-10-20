import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

import { CategoryDataTable } from '@/components/dashboard/category/data-table'
import { categoryColumns } from '@/components/dashboard/category/columns'

import { fetchAllCategories } from '@/app/api/dashboard/category'

const CategoriesPage = async () => {
  noStore()
  const categories = await fetchAllCategories()
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
          Categories
        </Heading>

        <Button>
          <PlusIcon />
          <Link href={'/dashboard/categories/create'}>Create New</Link>
        </Button>
      </div>

      {/* main */}
      <CategoryDataTable data={categories} columns={categoryColumns} />
    </Container>
  )
}

export default CategoriesPage
