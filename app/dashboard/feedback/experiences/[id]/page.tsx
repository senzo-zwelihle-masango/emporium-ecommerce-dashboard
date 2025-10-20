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

async function fetchExperience(id: string) {
  noStore()

  try {
    const experience = await prisma.experience.findUnique({
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
      },
    })

    if (!experience) {
      return notFound()
    }

    return experience
  } catch {
    toast.error('Error fetching experience:')
    return notFound()
  }
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const experience = await fetchExperience(id)

  const handleUpdateStatus = async (experienceId: string, status: string) => {
    'use server'
    // Implementation would go here
    toast.info(`Updating experience ${experienceId} status to ${status}`)
  }

  const handleDelete = async (experienceId: string) => {
    'use server'
    // Implementation would go here
    toast.info(`Deleting experience ${experienceId}`)
  }

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="experience-detail"
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
          <Heading
            size={'5xl'}
            spacing={'normal'}
            lineHeight={'none'}
            weight={'bold'}
            margin={'none'}
          >
            Experience Details
          </Heading>
          <p className="text-muted-foreground">Manage and respond to customer user experiences</p>
        </div>
        <Separator />
        <FeedbackManager
          type="experience"
          item={experience}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      </div>
    </Container>
  )
}
