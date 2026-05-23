'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { EventCard } from '@/components/EventCard'
import { EVENTS } from '@/lib/data'

export default function DashboardPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'
  const upcomingEvents = EVENTS.slice(0, 3)

  return (
    <div className="p-6 md:p-10 max-w-5xl">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-body mb-1" style={{ color: 'rgba(240,234,255,0.35)' }}>
          {new Date().toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="h-lg" style={{ color: '#F0EAFF' }}>
          Hey, {name.split(' ')[0]} 👋
        </h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Saved Events',     value: '0',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> },
          { label: 'Events Attended',  value: '0',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> },
          { label: 'Categories',       value: '5',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="gcard rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(123,63,228,0.15)', color: '#C4B5FD' }}>{icon}</div>
            </div>
            <div className="font-display font-bold text-2xl mb-0.5" style={{ color: '#F0EAFF' }}>{value}</div>
            <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.3)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming events */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="h-md" style={{ color: '#F0EAFF' }}>Upcoming events</h2>
          <Link href="/events" className="text-xs font-body flex items-center gap-1 transition-colors" style={{ color: '#C4B5FD' }}>
            View all
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingEvents.map(ev => <EventCard key={ev.id} event={ev} />)}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="h-md mb-5" style={{ color: '#F0EAFF' }}>Quick actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/events" className="gcard rounded-2xl p-5 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
              style={{ background: 'rgba(123,63,228,0.15)', color: '#C4B5FD' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <div>
              <div className="font-display font-semibold text-sm mb-0.5" style={{ color: '#F0EAFF' }}>Browse Events</div>
              <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.3)' }}>Discover verified events</div>
            </div>
          </Link>
          <Link href="/dashboard/bookmarks" className="gcard rounded-2xl p-5 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(123,63,228,0.15)', color: '#C4B5FD' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <div className="font-display font-semibold text-sm mb-0.5" style={{ color: '#F0EAFF' }}>Saved Events</div>
              <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.3)' }}>View your bookmarks</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
