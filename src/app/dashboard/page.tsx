'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { EventCard } from '@/components/EventCard'
import { getEvents } from '@/lib/supabase/queries'
import type { Event } from '@/lib/data'

export default function DashboardPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setUser(data.user)
      const listed = await getEvents()
      if (!mounted) return
      setEvents(listed.slice(0, 3))
      setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="mb-10">
        <p className="text-sm font-body mb-1" style={{ color: 'rgba(240,234,255,0.35)' }}>
          {new Date().toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="h-lg" style={{ color: '#F0EAFF' }}>
          Hey, {name.split(' ')[0]} 👋
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Saved Events', value: '0' },
          { label: 'Events Attended', value: '0' },
          { label: 'Categories', value: '5' },
        ].map(({ label, value }) => (
          <div key={label} className="gcard rounded-2xl p-5">
            <div className="font-display font-bold text-2xl mb-0.5" style={{ color: '#F0EAFF' }}>{value}</div>
            <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.3)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="h-md" style={{ color: '#F0EAFF' }}>Upcoming events</h2>
          <Link href="/events" className="text-xs font-body flex items-center gap-1 transition-colors" style={{ color: '#C4B5FD' }}>
            View all
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {loading ? (
          <div className="gcard rounded-2xl p-8 flex items-center justify-center">
            <div className="spinner w-8 h-8" />
          </div>
        ) : events.length === 0 ? (
          <div className="gcard rounded-2xl p-8 text-center">
            <p className="font-body text-sm" style={{ color: 'rgba(240,234,255,0.35)' }}>
              No events are published yet.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </div>

      <div>
        <h2 className="h-md mb-5" style={{ color: '#F0EAFF' }}>Quick actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/events" className="gcard rounded-2xl p-5 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(123,63,228,0.15)', color: '#C4B5FD' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <div>
              <div className="font-display font-semibold text-sm mb-0.5" style={{ color: '#F0EAFF' }}>Browse Events</div>
              <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.3)' }}>Discover verified events</div>
            </div>
          </Link>

          <Link href="/organizers" className="gcard rounded-2xl p-5 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(123,63,228,0.15)', color: '#C4B5FD' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div className="font-display font-semibold text-sm mb-0.5" style={{ color: '#F0EAFF' }}>Organizers</div>
              <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.3)' }}>View trusted organizers</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
