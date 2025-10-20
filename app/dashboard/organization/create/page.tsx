import React from 'react'

import { Container } from '@/components/ui/container'

import CreateOrganizationForm from '@/components/dashboard/organization/create-organization'

const CreateOrganizationPage = () => {
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="organization"
      className="my-4"
    >
      <CreateOrganizationForm />
    </Container>
  )
}

export default CreateOrganizationPage
