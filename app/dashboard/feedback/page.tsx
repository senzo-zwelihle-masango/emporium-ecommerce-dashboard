import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { DataTable } from '@/components/dashboard/feedback/data-table'
import { reviewColumns, experienceColumns } from '@/components/dashboard/feedback/columns'

import { fetchAllReviews, fetchAllExperiences } from '@/app/api/dashboard/feedback'

async function fetchData() {
  noStore()
  const [reviews, experiences] = await Promise.all([fetchAllReviews(), fetchAllExperiences()])
  return { reviews, experiences }
}

const FeedbackPage = async () => {
  const { reviews, experiences } = await fetchData()
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="feedback"
      className="my-4"
    >
      <div className="space-y-6">
        <div>
          <Heading
            size={'5xl'}
            spacing={'normal'}
            lineHeight={'none'}
            weight={'bold'}
            margin={'none'}
          >
            Feedback
          </Heading>
          <p>Manage and view all product reviews and user experiences</p>
        </div>

        <Tabs defaultValue="reviews" className="w-full">
          <TabsList>
            <TabsTrigger value="reviews">Product Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value="experiences">User Experiences ({experiences.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="reviews" className="mt-6">
            <DataTable data={reviews} columns={reviewColumns} type="reviews" />
          </TabsContent>
          <TabsContent value="experiences" className="mt-6">
            <DataTable data={experiences} columns={experienceColumns} type="experiences" />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}

export default FeedbackPage
