import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

import { Heading } from '@/components/ui/heading'

import { DataTable } from '@/components/dashboard/task/data-table'
import { columns } from '@/components/dashboard/task/columns'

import { fetchAllTasks } from '@/app/api/dashboard/task'

const TasksPage = async () => {
  noStore()
  const tasks = await fetchAllTasks()

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="tasks"
      className="my-4"
    >
      {/* header */}
      <div className="mb-5 flex items-center justify-between">
        <Heading
          size={'5xl'}
          spacing={'normal'}
          lineHeight={'none'}
          weight={'bold'}
          margin={'none'}
        >
          Tasks
        </Heading>

        <Button>
          <PlusIcon />
          <Link href={'/dashboard/documents/tasks/create'}>Create Task</Link>
        </Button>
      </div>

      {/* main */}
      <DataTable data={tasks} columns={columns} />
    </Container>
  )
}

export default TasksPage
