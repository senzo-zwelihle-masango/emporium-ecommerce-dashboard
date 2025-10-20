import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Container } from '@/components/ui/container'

const NoteLoading = () => {
  return (
    <Container
      id="loading"
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      className="my-4"
    >
      <Card className="border-t-primary border-t-4 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <Skeleton className="h-8 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="ml-4 h-4 w-4" />
            <Skeleton className="h-4 w-40" />
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Separator className="my-6" />

          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-3 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  )
}

export default NoteLoading
