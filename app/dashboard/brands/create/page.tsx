import React from 'react'

import { Container } from '@/components/ui/container'

import CreateBrandForm from '@/components/dashboard/forms/create/create-brand'

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
      <CreateBrandForm />
    </Container>
  )
}

export default CreateTaskPage
