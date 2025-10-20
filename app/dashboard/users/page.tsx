import React from 'react'
import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'

import { UsersIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

import UsersTable from '@/components/dashboard/user/data-table'

import { fetchAllUsers } from '@/app/api/dashboard/user'

const Users = async () => {
  noStore()
  const users = await fetchAllUsers()
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="users"
      className="my-4"
    >
      {/* header */}
      <div className="mb-5 flex items-center justify-between">
        <Heading
          size={'4xl'}
          spacing={'normal'}
          lineHeight={'none'}
          weight={'bold'}
          margin={'none'}
        >
          Users
        </Heading>
        <Button>
          <Link href={'/dashboard/users/create'}>Create User</Link>
        </Button>
      </div>

      {/* main */}
      {users.length === 0 ? (
        <div className="my-40 flex flex-col items-center justify-center">
          <Heading size="sm" margin="md">
            No Users Found!
          </Heading>
          <UsersIcon size={80} />
        </div>
      ) : (
        <UsersTable users={users} />
      )}
    </Container>
  )
}

export default Users
