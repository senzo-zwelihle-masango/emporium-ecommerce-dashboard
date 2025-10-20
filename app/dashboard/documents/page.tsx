import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import DocumentCommand from '@/components/dashboard/document/document-command'
import { Heading } from '@/components/ui/heading'

import DocumentWrapper from '@/components/dashboard/document/document-wrapper'
import { fetchAllDocuments } from '@/app/api/dashboard/document'

const DocumentsPage = async () => {
  noStore()
  const documents = await fetchAllDocuments()
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
          Documents
        </Heading>

        <Button>
          <PlusIcon />
          <Link href={'/dashboard/documents/create'}>Upload New</Link>
        </Button>
      </div>

      {/* main */}

      <DocumentCommand />
      <DocumentWrapper documents={documents} />
    </Container>
  )
}

export default DocumentsPage
