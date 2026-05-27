'use client'

import { useEffect, useState } from 'react'
import { EventCard } from '@/components/EventCard'
import { Footer } from '@/components/Footer'
import { getEvents } from '@/lib/supabase/queries'

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      const data = await getEvents()
      setEvents(data)
      setLoading(false)
    }

    loadEvents()
  }, [])

  return (
    <div className="min-h-screen">
      <section className="page-header">
        <div className="container-page py-24">
          <h1
            className="h-xl mb-4"
            style={{ color: '#F0EAFF' }}
          >
            Discover Events
          </h1>

          <p
            className="font-body text-base max-w-xl"
            style={{ color: 'rgba(240,234,255,0.4)' }}
          >
            All events are now loaded directly from Supabase.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        {loading ? (
          <div style={{ color: '#F0EAFF' }}>Loading events...</div>
        ) : events.length === 0 ? (
          <div style={{ color: '#F0EAFF' }}>
            No events found in database.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
