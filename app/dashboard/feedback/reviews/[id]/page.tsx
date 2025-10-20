import React from 'react'
import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

import { prisma } from '@/lib/prisma/client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

import { FeedbackManager } from '@/components/dashboard/feedback/feedback-manager'

async function fetchReview(id: string) {
  noStore()

  try {
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            images: true,
            brand: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!review) {
      return notFound()
    }

    return review
  } catch (error) {
    toast.error('Error fetching review')
    return notFound()
  }
}

export default async function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const review = await fetchReview(id)

  const handleUpdateStatus = async (reviewId: string, status: string) => {
    'use server'
    // Implementation would go here
    toast.message(`Updating review ${reviewId} status to ${status}`)
  }

  const handleDelete = async (reviewId: string) => {
    'use server'
    // Implementation would go here
    toast.message(`Deleting review ${reviewId}`)
  }

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="review-detail"
      className="my-4"
    >
      <div className="space-y-6">
        <div>
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard/feedback">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Feedback
            </Link>
          </Button>
          <Heading size={'6xl'} spacing={'normal'} lineHeight={'none'} margin={'sm'}>
            Review Details
          </Heading>
          <p className="text-muted-foreground">Manage and respond to customer product reviews</p>
        </div>
        <Separator />
        <FeedbackManager
          type="review"
          item={review}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      </div>
    </Container>
  )
}
