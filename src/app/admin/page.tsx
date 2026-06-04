'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Stats {
  users:         number
  organizers:    number
  events:        number
  reviews:       number
  verified:      number
  pendingVerif:  number
}

interface RecentEvent {
  id:        string
  title:     string
  category:  string
  featured:  boolean
  created_at: string
}

interface RecentReview {
  id:         string
  event_id:   string
  created_at: string
  value_score: number
}

export default function AdminOverview() {
  const supabase = createClient()
  const [stats,         setStats]         = useState<Stats | null>(null)
  const [recentEvents,  setRecentEvents]  = useState<RecentEvent[]>([])
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([])
  const [loading,       setLoading]       = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const [
        { count: users },
        { count: organizers },
        { count: events },
        { count: reviews },
        { count: verified },
        { count: pendingVerif },
        { data: latestEvents },
        { data: latestReviews },
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'user'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'organizer'),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('verified', true),
        supabase.from('verification_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('events').select('id,title,category,featured,created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('reviews').select('id,event_id,created_at,value_score').order('created_at', { ascending: false }).limit(5),
      ])

      if (!mounted) return
      setStats({
        users:        users || 0,
        organizers:   organizers || 0,
        events:       events || 0,
        reviews:      reviews || 0,
        verified:     verified || 0,
        pendingVerif: pendingVerif || 0,
      })
      setRecentEvents((latestEvents || []) as RecentEvent[])
      setRecentReviews((latestReviews || []) as RecentReview[])
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  const statCards = stats ? [
    { label: 'Total Users',       value: stats.users,       note: 'Registered attendees',     color: '#C2820D' },
    { label: 'Organizers',        value: stats.organizers,  note: 'Active on platform',       color: '#1F7A68' },
    { label: 'Events Published',  value: stats.events,      note: 'Visible in discovery',     color: '#C2820D' },
    { label: 'Reviews',           value: stats.reviews,     note: 'Submitted by attendees',   color: '#1F7A68' },
    { label: 'Verified Orgs',     value: stats.verified,    note: 'Badge holders',            color: '#C2820D' },
    { label: 'Pending Verif.',    value: stats.pendingVerif,note: 'Awaiting your review',     color: stats.pendingVerif > 0 ? '#EF4444' : '#1F7A68' },
  ] : []

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <div className="sec-label sec-label-left mb-4"><span>Admin Core</span></div>
        <h1 className="h-lg mb-2" style={{ color: '#F0E8D6' }}>Platform overview</h1>
        <p className="font-body text-sm" style={{ color: 'rgba(240,232,214,0.38)' }}>
          Manage organizers, events, verification requests, and users from here.
        </p>
      </div>

      {/* Pending alert */}
      {stats && stats.pendingVerif > 0 && (
        <div className="flex items-center justify-between px-5 py-4 rounded-2xl"
          style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.22)' }}>
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-body text-sm font-semibold">
              {stats.pendingVerif} verification request{stats.pendingVerif > 1 ? 's' : ''} pending
            </span>
          </div>
          <Link href="/admin/verification" className="text-xs font-body font-semibold px-4 py-2 rounded-xl transition-all"
            style={{ background: 'rgba(239,68,68,0.18)', color: '#FCA5A5' }}>
            Review Now →
          </Link>
        </div>
      )}

      {/* Stats grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="gcard rounded-2xl p-6 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {statCards.map(({ label, value, note, color }) => (
            <div key={label} className="gcard rounded-2xl p-6">
              <p className="font-body text-xs mb-3" style={{ color: 'rgba(240,232,214,0.38)' }}>{label}</p>
              <p className="font-display font-bold text-4xl mb-1 tracking-tight" style={{ color }}>{value}</p>
              <p className="font-body text-xs" style={{ color: 'rgba(240,232,214,0.30)' }}>{note}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions + recent */}
      <div className="grid xl:grid-cols-2 gap-6">

        {/* Quick actions */}
        <div className="gcard rounded-2xl p-6">
          <h2 className="font-display font-semibold text-base mb-5" style={{ color: '#F0E8D6', letterSpacing: '-0.01em' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/admin/organizers',   label: 'Organizers',   sub: 'Grant or revoke badges'         },
              { href: '/admin/verification', label: 'Verification', sub: 'Review applications'            },
              { href: '/admin/events',       label: 'Events',       sub: 'Feature or remove events'       },
              { href: '/admin/users',        label: 'Users',        sub: 'Manage platform users'          },
            ].map(({ href, label, sub }) => (
              <Link key={href} href={href}
                className="rounded-xl p-4 transition-all hover:bg-white/5"
                style={{ border: '1px solid rgba(240,232,214,0.07)' }}>
                <p className="font-display font-semibold text-sm mb-1" style={{ color: '#F0E8D6' }}>{label}</p>
                <p className="font-body text-xs" style={{ color: 'rgba(240,232,214,0.32)' }}>{sub}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent events */}
        <div className="gcard rounded-2xl p-6">
          <h2 className="font-display font-semibold text-base mb-5" style={{ color: '#F0E8D6', letterSpacing: '-0.01em' }}>
            Recent Events
          </h2>
          {recentEvents.length === 0 ? (
            <p className="font-body text-sm" style={{ color: 'rgba(240,232,214,0.28)' }}>No events yet.</p>
          ) : (
            <div className="space-y-3">
              {recentEvents.map(ev => (
                <div key={ev.id} className="flex items-center gap-3 py-2"
                  style={{ borderBottom: '1px solid rgba(240,232,214,0.05)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm truncate" style={{ color: '#F0E8D6' }}>{ev.title}</p>
                    <p className="font-body text-xs" style={{ color: 'rgba(240,232,214,0.30)' }}>
                      {ev.category} {ev.featured ? '· Featured' : ''}
                    </p>
                  </div>
                  <span className="text-xs font-body px-2.5 py-1 rounded-lg flex-shrink-0"
                    style={{ background: 'rgba(31,122,104,0.14)', color: '#27967F' }}>
                    Live
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
