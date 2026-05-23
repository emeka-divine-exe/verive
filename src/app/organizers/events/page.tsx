'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type OrgEvent = {
  id: string
  title: string
  category: string
  date: string
  location: string
  price: number
  status: string
  created_at: string
}

const statusStyle: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Under Review', color: '#FCD34D', bg: 'rgba(245,158,11,0.14)' },
  published: { label: 'Published',    color: '#6EE7B7', bg: 'rgba(16,185,129,0.14)' },
  rejected:  { label: 'Rejected',     color: '#FCA5A5', bg: 'rgba(239,68,68,0.14)'  },
  draft:     { label: 'Draft',        color: 'rgba(240,234,255,0.35)', bg: 'rgba(196,181,253,0.08)' },
}

export default function OrganizerEventsPage() {
  const supabase = createClient()
  const [events,  setEvents]  = useState<OrgEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('events')
        .select('id,title,category,date,location,price,status,created_at')
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false })
      setEvents(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h-lg mb-1" style={{ color: '#F0EAFF' }}>My Events</h1>
          <p className="font-body text-sm" style={{ color: 'rgba(240,234,255,0.35)' }}>
            Manage your event listings
          </p>
        </div>
        <Link href="/organizer/events/new" className="btn-pri text-white font-semibold px-6 py-3 text-sm">
          + Post Event
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <svg className="spinner w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#7B3FE4" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
        </div>
      ) : events.length === 0 ? (
        <div className="gcard rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="font-display font-semibold mb-2" style={{ color: '#F0EAFF', fontSize: '1rem' }}>No events yet</h3>
          <p className="font-body text-sm mb-6" style={{ color: 'rgba(240,234,255,0.32)' }}>Post your first event to get started.</p>
          <Link href="/organizer/events/new" className="btn-pri text-white font-semibold px-7 py-3 text-sm">
            Post New Event
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(ev => {
            const st = statusStyle[ev.status] || statusStyle.draft
            return (
              <div key={ev.id} className="gcard rounded-2xl p-5 flex items-center gap-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <h3 className="font-display font-semibold text-base truncate" style={{ color: '#F0EAFF' }}>
                      {ev.title}
                    </h3>
                    <span className="text-[0.65rem] font-body font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ color: st.color, background: st.bg }}>
                      {st.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs font-body" style={{ color: 'rgba(240,234,255,0.32)' }}>
                    <span>{ev.date}</span>
                    <span>·</span>
                    <span>{ev.location}</span>
                    <span>·</span>
                    <span className="capitalize">{ev.category}</span>
                    <span>·</span>
                    <span>{ev.price === 0 ? 'Free' : `₦${ev.price.toLocaleString()}`}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/events/${ev.id}`}
                    className="btn-ghost px-4 py-2 text-xs">View</Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
