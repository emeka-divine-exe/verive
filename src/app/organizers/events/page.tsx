'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { deleteOrganizerEvent, getOrganizerDashboard } from '@/lib/supabase/organizer'
import type { Event } from '@/lib/data'

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  published: { label: 'Published', color: '#6EE7B7', bg: 'rgba(16,185,129,0.14)' },
  draft: { label: 'Draft', color: 'rgba(240,234,255,0.36)', bg: 'rgba(196,181,253,0.08)' },
  pending: { label: 'Pending', color: '#FCD34D', bg: 'rgba(245,158,11,0.14)' },
  rejected: { label: 'Rejected', color: '#FCA5A5', bg: 'rgba(239,68,68,0.14)' },
}

const FILTERS = ['all', 'draft', 'pending', 'published', 'rejected'] as const
type Filter = typeof FILTERS[number]

export default function OrganizerEventsPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      const { data: auth } = await supabase.auth.getUser()
      if (!mounted) return
      if (!auth.user) {
        setLoading(false)
        return
      }

      setUser(auth.user)
      const dashboard = await getOrganizerDashboard(auth.user.id)
      if (!mounted) return
      setEvents(dashboard.events)
      setLoading(false)
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(
    () => filter === 'all' ? events : events.filter((event) => event.status === filter),
    [events, filter],
  )

  async function handleDelete(id: string) {
    if (!user) return
    setDeletingId(id)
    try {
      await deleteOrganizerEvent(id, user.id)
      setEvents((current) => current.filter((event) => event.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-6xl">
        <div className="py-24 flex justify-center">
          <svg className="spinner w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#7B3FE4" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity=".25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="h-lg mb-1" style={{ color: '#F0EAFF' }}>My Events</h1>
          <p className="font-body text-sm" style={{ color: 'rgba(240,234,255,0.35)' }}>
            Create, edit, and manage your organizer listings.
          </p>
        </div>

        <Link href="/organizers/events/new" className="btn-pri text-white font-semibold px-6 py-3 text-sm">
          + Post Event
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className="px-4 py-2 rounded-full text-xs font-body transition-all"
            style={{
              background: filter === item ? 'rgba(123,63,228,0.18)' : 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(196,181,253,0.12)',
              color: filter === item ? '#F0EAFF' : 'rgba(240,234,255,0.36)',
            }}
          >
            {item === 'all' ? 'All' : item}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="gcard rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="font-display font-semibold mb-2" style={{ color: '#F0EAFF', fontSize: '1rem' }}>
            No events yet
          </h3>
          <p className="font-body text-sm mb-6" style={{ color: 'rgba(240,234,255,0.32)' }}>
            Publish your first event to start building your organizer presence.
          </p>
          <Link href="/organizers/events/new" className="btn-pri text-white font-semibold px-7 py-3 text-sm">
            Post New Event
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((event) => {
            const status = STATUS_META[event.status || 'draft'] || STATUS_META.draft
            return (
              <div key={event.id} className="gcard rounded-2xl p-5 flex items-center gap-4 flex-wrap md:flex-nowrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-display font-semibold text-base truncate" style={{ color: '#F0EAFF' }}>
                      {event.title}
                    </h3>
                    <span className="text-[0.65rem] font-body font-semibold px-2.5 py-1 rounded-full" style={{ background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                    {event.featured && (
                      <span className="text-[0.65rem] font-body font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(123,63,228,0.14)', color: '#C4B5FD' }}>
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs font-body" style={{ color: 'rgba(240,234,255,0.32)' }}>
                    <span>{event.date}</span>
                    <span>·</span>
                    <span>{event.time}</span>
                    <span>·</span>
                    <span>{event.location}</span>
                    <span>·</span>
                    <span className="capitalize">{event.category}</span>
                    <span>·</span>
                    <span>{event.price === 0 ? 'Free' : `₦${Number(event.price).toLocaleString()}`}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/events/${event.id}`} className="btn-ghost px-4 py-2 text-xs">
                    View
                  </Link>
                  <Link href={`/organizers/events/${event.id}/edit`} className="btn-ghost px-4 py-2 text-xs">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={deletingId === event.id}
                    className="btn-ghost px-4 py-2 text-xs"
                    style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'rgba(248,113,113,0.8)' }}
                  >
                    {deletingId === event.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
