import React from 'react'

import { Container } from '@/components/ui/container'

import CreateNewWarehouseForm from '@/components/dashboard/forms/create/create-warehouse'

const CreateNewWarehousePage = () => {
  return (
    <Container
      id="ai-assistant"
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      className="my-4"
    >
      <CreateNewWarehouseForm />
    </Container>
  )
}

export default CreateNewWarehousePage
