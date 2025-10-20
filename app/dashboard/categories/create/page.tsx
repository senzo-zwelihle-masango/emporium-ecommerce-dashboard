import React from 'react'

import { Container } from '@/components/ui/container'

import CreateCategoryForm from '@/components/dashboard/forms/create/create-category'

const CreateCategoryPage = () => {
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="create-category"
      className="my-4"
    >
      <CreateCategoryForm />
    </Container>
  )
}

export default CreateCategoryPage
