import React from 'react'

import { Container } from '@/components/ui/container'

import CreateDocumentForm from '@/components/dashboard/forms/create/create-document'

const CreateTaskPage = () => {
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="create-task"
      className="my-4"
    >
      {/* main */}
      <CreateDocumentForm />
    </Container>
  )
}

export default CreateTaskPage
