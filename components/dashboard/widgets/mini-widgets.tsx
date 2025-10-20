'use client'

import {
  MiniCalendar,
  MiniCalendarNavigation,
  MiniCalendarDays,
  MiniCalendarDay,
} from '@/components/ui/mini-calendar'
import {
  RelativeTime,
  RelativeTimeZone,
  RelativeTimeZoneDisplay,
  RelativeTimeZoneLabel,
} from '@/components/ui/relative-time'

export function CalendarWidget() {
  return (
    <MiniCalendar className="w-full">
      <MiniCalendarNavigation direction="prev" />
      <MiniCalendarDays>
        {(date) => <MiniCalendarDay key={date.toISOString()} date={date} />}
      </MiniCalendarDays>
      <MiniCalendarNavigation direction="next" />
    </MiniCalendar>
  )
}

export function TimeZoneWidget() {
  return (
    <div className="space-y-3">
      <RelativeTime>
        <RelativeTimeZone zone="America/New_York">
          <RelativeTimeZoneLabel>NYC</RelativeTimeZoneLabel>
          <RelativeTimeZoneDisplay />
        </RelativeTimeZone>
        <RelativeTimeZone zone="Europe/London">
          <RelativeTimeZoneLabel>LON</RelativeTimeZoneLabel>
          <RelativeTimeZoneDisplay />
        </RelativeTimeZone>
        <RelativeTimeZone zone="Asia/Tokyo">
          <RelativeTimeZoneLabel>TYO</RelativeTimeZoneLabel>
          <RelativeTimeZoneDisplay />
        </RelativeTimeZone>
        <RelativeTimeZone zone="Africa/Johannesburg">
          <RelativeTimeZoneLabel>JHB</RelativeTimeZoneLabel>
          <RelativeTimeZoneDisplay />
        </RelativeTimeZone>
      </RelativeTime>
    </div>
  )
}
