import React from 'react'

import { Container } from '@/components/ui/container'

import CreateNoteForm from '@/components/dashboard/forms/create/create-note'

const CreateNotePage = () => {
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="create-note"
      className="my-4"
    >
      {/* main */}
      <CreateNoteForm />
    </Container>
  )
}

export default CreateNotePage
