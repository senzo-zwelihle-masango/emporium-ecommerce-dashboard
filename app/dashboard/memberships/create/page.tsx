import React from 'react'

import { Container } from '@/components/ui/container'

import CreateMembershipForm from '@/components/dashboard/forms/create/create-membership'

const CreateMembershipPage = () => {
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="create"
      className="my-4"
    >
      <CreateMembershipForm />
    </Container>
  )
}

export default CreateMembershipPage
