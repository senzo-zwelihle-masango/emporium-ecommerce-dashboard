import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'

export async function fetchAllEvents() {
  noStore()
  const events = await prisma.event.findMany({
    orderBy: {
      start: 'asc',
    },
  })
  return events
}

export async function fetchEventById(id: string) {
  noStore()
  const event = await prisma.event.findUnique({
    where: { id },
  })
  return event
}
