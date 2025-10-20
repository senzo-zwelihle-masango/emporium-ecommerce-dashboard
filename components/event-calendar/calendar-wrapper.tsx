'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { EventCalendar, type CalendarEvent } from '@/components/event-calendar'
import {
  createEventAction,
  updateEventAction,
  deleteEventAction,
} from '@/server/actions/dashboard/event'
import { transformPrismaEventToCalendarEvent } from '@/components/event-calendar/utils'
import { Event } from '@/lib/generated/prisma'
import { fetchAllEvents } from '@/app/api/dashboard/event'

interface EventCalendarWrapperProps {
  initialEvents: Event[]
}

export function EventCalendarWrapper({ initialEvents }: EventCalendarWrapperProps) {
  const router = useRouter()
  // Transform initial events from Prisma format to CalendarEvent format
  const transformedInitialEvents = initialEvents.map((event) =>
    transformPrismaEventToCalendarEvent(event)
  )
  const [events, setEvents] = useState<CalendarEvent[]>(transformedInitialEvents)
  const [isLoading, setIsLoading] = useState(false)

  // Function to refresh events from the server
  const refreshEvents = async () => {
    setIsLoading(true)
    try {
      const fetchedEvents = await fetchAllEvents()
      // Transform Prisma events to CalendarEvents
      const transformedEvents = fetchedEvents.map((event: any) =>
        transformPrismaEventToCalendarEvent(event)
      )
      setEvents(transformedEvents)
      toast.success('Events refreshed')
    } catch (error) {
      toast.error('Failed to refresh events')
      console.error('Error refreshing events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  //  periodic refresh (every 10 seconds for more updates)
  useEffect(() => {
    let isMounted = true

    const interval = setInterval(() => {
      if (isMounted) {
        refreshEvents()
      }
    }, 3600000) // 1 hour

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const handleEventAdd = async (eventData: CalendarEvent) => {
    // Ensure the event data matches the expected schema
    const eventDataForSubmission = {
      title: eventData.title || 'Untitled Event',
      description: eventData.description || '',
      start: eventData.start,
      end: eventData.end,
      allDay: eventData.allDay || false,
      color: eventData.color || 'sky',
      location: eventData.location || '',
      contact: eventData.contact || '',
    }

    const response = await createEventAction(eventDataForSubmission)
    if (response.status === 'success') {
      toast.success(response.message)
      // Instead of router.refresh(), update the local state directly
      await refreshEvents() // This will fetch the latest events including the new one
    } else {
      toast.error(response.message)
    }
  }

  const handleEventUpdate = async (eventData: CalendarEvent) => {
    // Ensure the event data matches the expected schema
    const eventDataForSubmission = {
      id: eventData.id,
      title: eventData.title || 'Untitled Event',
      description: eventData.description || '',
      start: eventData.start,
      end: eventData.end,
      allDay: eventData.allDay || false,
      color: eventData.color || 'sky',
      location: eventData.location || '',
      contact: eventData.contact || '',
    }

    const response = await updateEventAction(eventDataForSubmission)
    if (response.status === 'success') {
      toast.success(response.message)
      // Instead of router.refresh(), update the local state directly
      await refreshEvents() // This will fetch the latest events including the updated one
    } else {
      toast.error(response.message)
    }
  }

  const handleEventDelete = async (eventId: string) => {
    const response = await deleteEventAction(eventId)
    if (response.status === 'success') {
      toast.success(response.message)
      // Update the local state directly
      await refreshEvents() // This will fetch the latest events excluding the deleted one
    } else {
      toast.error(response.message)
    }
  }

  return (
    <EventCalendar
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      onRefresh={refreshEvents}
      isLoading={isLoading}
    />
  )
}
