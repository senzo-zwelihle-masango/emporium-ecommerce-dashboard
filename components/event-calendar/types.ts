export type CalendarView = 'month' | 'week' | 'day' | 'agenda'

export interface CalendarEvent {
  id: string
  title: string
  description?: string | null
  start: Date
  end: Date
  allDay?: boolean
  color?: EventColor
  location?: string | null
  contact?: string | null
}

export type EventColor = 'sky' | 'amber' | 'violet' | 'rose' | 'emerald' | 'orange'
