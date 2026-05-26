'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { EventCard } from '@/components/EventCard'
import { getEvents } from '@/lib/supabase/queries'

export default function DashboardPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    getEvents().then((data) => setUpcomingEvents(data.slice(0, 3)))
  }, [])

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="mb-10">
        <p className="text-sm font-body mb-1" style={{ color: 'rgba(240,234,255,0.35)' }}>
          {new Date().toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="h-lg" style={{ color: '#F0EAFF' }}>
          Hey, {name.split(' ')[0]} 👋
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {upcomingEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <div className="mt-10">
        <Link href="/events" className="btn-pri px-6 py-3 text-white rounded-xl">
          Explore More Events
        </Link>
      </div>
    </div>
  )
}
