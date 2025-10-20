import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/dashboard/ticket/data-table'
import { columns } from '@/components/dashboard/ticket/columns'
import { fetchAllTickets } from '@/app/api/dashboard/ticket'

const TicketsPage = async () => {
  noStore()
  const tickets = await fetchAllTickets()

  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      id="tickets"
      className="my-4"
    >
      <div className="mb-5 flex items-center justify-between">
        <Heading
          size={'5xl'}
          spacing={'normal'}
          lineHeight={'none'}
          weight={'bold'}
          margin={'none'}
        >
          Tickets
        </Heading>
        <Button>
          <PlusIcon />
          <Link href="/dashboard/tickets/create">Add Ticket</Link>
        </Button>
      </div>
      <DataTable columns={columns} data={tickets} />
    </Container>
  )
}

export default TicketsPage
