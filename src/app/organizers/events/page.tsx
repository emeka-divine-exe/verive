'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { deleteOrganizerEvent, getOrganizerDashboard } from '@/lib/supabase/organizer'
import type { Event } from '@/lib/data'

// Events have no draft/pending/rejected state in the real schema — every event
// you post here is already live the moment it's created. "Featured" is the only
// real status flag, set by the admin team.
const FILTERS = ['all', 'featured'] as const
type Filter = typeof FILTERS[number]

export default function OrganizerEventsPage() {
  const supabase = createClient()
  const [user,       setUser]       = useState<any>(null)
  const [events,     setEvents]     = useState<Event[]>([])
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState<Filter>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      const { data: auth } = await supabase.auth.getUser()
      if (!mounted) return
      if (!auth.user) { setLoading(false); return }
      setUser(auth.user)
      const dashboard = await getOrganizerDashboard(auth.user.id)
      if (!mounted) return
      setEvents(dashboard.events)
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(
    () => filter === 'all' ? events : events.filter(e => e.featured),
    [events, filter],
  )

  async function handleDelete(id: string) {
    if (!user) return
    setDeletingId(id)
    try {
      await deleteOrganizerEvent(id, user.id)
      setEvents(curr => curr.filter(e => e.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-6xl">
        <div className="py-24 flex justify-center">
          <svg className="spinner w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="var(--v-gold)" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
            <path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="h-lg mb-1" style={{ color: 'var(--v-text)' }}>My Events</h1>
          <p className="font-body text-sm" style={{ color: 'var(--v-muted)' }}>
            Every event you post goes live immediately — no approval step. Create, edit, and manage your listings here.
          </p>
        </div>
        <Link href="/organizers/events/new" className="btn-pri px-6 py-3 text-sm">
          + Post Event
        </Link>
      </div>

      {/* Filter tabs — All vs Featured only, since that's the only real status flag */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(item => (
          <button key={item} onClick={() => setFilter(item)}
            className="px-4 py-2 rounded-full text-xs font-body transition-all capitalize"
            style={{
              background: filter === item ? 'var(--v-gold-dim)' : 'var(--v-border)',
              border: `1px solid ${filter === item ? 'var(--v-gold-border)' : 'var(--v-border-s)'}`,
              color: filter === item ? 'var(--v-gold)' : 'var(--v-ghost)',
            }}>
            {item === 'all' ? 'All' : 'Featured'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="gcard rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="font-display font-semibold mb-2"
            style={{ color: 'var(--v-text)', fontSize: '1rem' }}>
            {filter === 'featured' ? 'No featured events yet' : 'No events yet'}
          </h3>
          <p className="font-body text-sm mb-6" style={{ color: 'var(--v-muted)' }}>
            {filter === 'featured'
              ? 'Featured placements are granted by the Verive team as your reputation grows.'
              : 'Publish your first event to start building your organizer presence.'}
          </p>
          {filter === 'all' && (
            <Link href="/organizers/events/new" className="btn-pri px-7 py-3 text-sm">
              Post New Event
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(event => (
            <div key={event.id} className="gcard rounded-2xl p-5 flex items-center gap-4 flex-wrap md:flex-nowrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-display font-semibold text-base truncate"
                    style={{ color: 'var(--v-text)' }}>
                    {event.title}
                  </h3>
                  <span className="text-[0.65rem] font-body font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(16,185,129,0.14)', color: '#6EE7B7' }}>
                    Live
                  </span>
                  {event.featured && (
                    <span className="text-[0.65rem] font-body font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: 'var(--v-gold-dim)', color: 'var(--v-gold)' }}>
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-xs font-body" style={{ color: 'var(--v-muted)' }}>
                  <span>{event.date}</span><span>·</span>
                  <span>{event.time}</span><span>·</span>
                  <span>{event.location}</span><span>·</span>
                  <span className="capitalize">{event.category}</span><span>·</span>
                  <span>{event.price === 0 ? 'Free' : `₦${Number(event.price).toLocaleString()}`}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/events/${event.id}`} className="btn-ghost px-4 py-2 text-xs">View</Link>
                <Link href={`/organizers/events/${event.id}/edit`} className="btn-ghost px-4 py-2 text-xs">Edit</Link>
                <button onClick={() => handleDelete(event.id)} disabled={deletingId === event.id}
                  className="btn-ghost px-4 py-2 text-xs"
                  style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'rgba(248,113,113,0.8)' }}>
                  {deletingId === event.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
              }
