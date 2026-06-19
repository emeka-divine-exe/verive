'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { getOrganizerDashboard } from '@/lib/supabase/organizer'
import { CATEGORY_META, type Organizer } from '@/lib/data'

type DashboardData = Awaited<ReturnType<typeof getOrganizerDashboard>>

const QUICK_ACTIONS = [
  { label: 'Post Event',      href: '/organizers/events/new', desc: 'Create a new event — it goes live instantly' },
  { label: 'Manage Events',   href: '/organizers/events',     desc: 'Edit or remove your live listings' },
  { label: 'Media Library',   href: '/organizers/media',      desc: 'Upload logo and cover assets' },
  { label: 'Profile Settings',href: '/organizers/settings',   desc: 'Update organizer profile details' },
]

function StatCard({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="gcard rounded-2xl p-5">
      <div className="text-xs uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--v-ghost)' }}>{label}</div>
      <div className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--v-text)' }}>{value}</div>
      {note && <div className="text-xs font-body" style={{ color: 'var(--v-muted)' }}>{note}</div>}
    </div>
  )
}

export default function OrganizerDashboardPage() {
  const supabase = createClient()
  const [user,    setUser]    = useState<any>(null)
  const [data,    setData]    = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      const { data: auth } = await supabase.auth.getUser()
      if (!mounted) return
      if (!auth.user) {
        setError('Please log in to access your organizer dashboard.')
        setLoading(false)
        return
      }
      setUser(auth.user)
      try {
        const dashboard = await getOrganizerDashboard(auth.user.id)
        if (!mounted) return
        setData(dashboard)
      } catch (err: any) {
        if (!mounted) return
        setError(err?.message || 'Unable to load dashboard data.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const profile     = data?.profile as Organizer | null
  const isVerified  = profile?.verified === true
  const firstName   = profile?.name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'Organizer'

  const topCategories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const event of data?.events || []) {
      counts.set(event.category, (counts.get(event.category) || 0) + 1)
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3)
  }, [data?.events])

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-6xl">
        <div className="flex items-center gap-3 py-20 justify-center">
          <svg className="spinner w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="var(--v-gold)" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
            <path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
          <span className="font-body" style={{ color: 'var(--v-muted)' }}>Loading your dashboard…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 md:p-10 max-w-4xl">
        <div className="gcard rounded-2xl p-8">
          <h1 className="h-md mb-2" style={{ color: 'var(--v-text)' }}>Organizer Dashboard</h1>
          <p className="font-body text-sm" style={{ color: 'var(--v-muted)' }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="mb-10 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-body mb-1" style={{ color: 'var(--v-muted)' }}>
            {new Date().toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="h-lg" style={{ color: 'var(--v-text)' }}>Welcome, {firstName}</h1>
            {isVerified && <VerifiedBadge size={22} />}
          </div>
          <p className="font-body text-sm mt-3 max-w-2xl" style={{ color: 'var(--v-muted)' }}>
            Manage your events, profile, media, and organizer visibility from one place.
          </p>
        </div>

        <div className="gcard rounded-2xl p-5 min-w-[240px]">
          <div className="text-xs uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--v-ghost)' }}>Verification</div>
          <div className="flex items-center gap-2">
            <VerifiedBadge size={16} />
            <span className="font-display font-semibold" style={{ color: 'var(--v-text)' }}>
              {isVerified ? 'Verified organizer' : 'Verification pending'}
            </span>
          </div>
          <p className="text-xs font-body mt-2" style={{ color: 'var(--v-muted)' }}>
            {isVerified ? 'Your badge is live across your organizer profile.' : 'Submit a verification request to unlock trust visibility.'}
          </p>
        </div>
      </div>

      {/* Real stats only — events have no draft/published distinction in the schema */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Events Posted" value={data?.stats.totalEvents || 0} note="All live" />
        <StatCard label="Featured"      value={data?.stats.featuredCount || 0} note="Boosted by Verive" />
        <StatCard label="Fill Rate"     value={`${data?.stats.fillRate || 0}%`} note="Based on capacity" />
        <StatCard label="Attendees"     value={data?.stats.totalFilled || 0} note="Across all events" />
      </div>

      <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-6 mb-10">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="h-md" style={{ color: 'var(--v-text)' }}>Quick Actions</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.href} href={action.href}
                className="gcard rounded-2xl p-5 flex items-start gap-4 group transition-transform hover:-translate-y-0.5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--v-gold-dim)', color: 'var(--v-gold)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--v-text)' }}>{action.label}</div>
                  <div className="text-xs font-body" style={{ color: 'var(--v-muted)' }}>{action.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="gcard rounded-2xl p-5">
          <h2 className="h-md mb-4" style={{ color: 'var(--v-text)' }}>Top Categories</h2>
          {topCategories.length === 0 ? (
            <p className="text-sm font-body" style={{ color: 'var(--v-muted)' }}>No events yet.</p>
          ) : (
            <div className="space-y-3">
              {topCategories.map(([category, count]) => {
                const meta = CATEGORY_META[category as keyof typeof CATEGORY_META]
                return (
                  <div key={category} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`tag ${meta.tagClass}`}>{meta.emoji}</span>
                      <span className="font-body text-sm" style={{ color: 'var(--v-text)' }}>{meta.label}</span>
                    </div>
                    <span className="text-xs font-body" style={{ color: 'var(--v-muted)' }}>{count} events</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-6">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="h-md" style={{ color: 'var(--v-text)' }}>Recent Events</h2>
            <Link href="/organizers/events" className="text-xs font-body" style={{ color: 'var(--v-gold)' }}>Manage all</Link>
          </div>

          <div className="space-y-3">
            {(data?.recentEvents || []).length === 0 ? (
              <div className="gcard rounded-2xl p-8 text-center">
                <p className="font-body text-sm" style={{ color: 'var(--v-muted)' }}>No events yet. Create your first organizer event.</p>
              </div>
            ) : (
              (data?.recentEvents || []).map((event) => (
                <div key={event.id} className="gcard rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--v-text)' }}>{event.title}</h3>
                    <p className="text-xs font-body" style={{ color: 'var(--v-muted)' }}>
                      {event.date} · {event.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-body px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(16,185,129,0.14)', color: '#6EE7B7' }}>
                      Live
                    </span>
                    {event.featured && (
                      <span className="text-xs font-body px-2.5 py-1 rounded-full"
                        style={{ background: 'var(--v-gold-dim)', color: 'var(--v-gold)' }}>
                        Featured
                      </span>
                    )}
                    <Link href={`/organizers/events/${event.id}/edit`} className="btn-ghost px-3 py-2 text-xs">
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="gcard rounded-2xl p-5">
          <h2 className="h-md mb-4" style={{ color: 'var(--v-text)' }}>Profile Snapshot</h2>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-bold text-xl"
              style={{ background: profile?.avatarColor || 'var(--v-gold-dim)', color: 'var(--v-gold)' }}>
              {profile?.initials || 'OR'}
            </div>
            <div className="min-w-0">
              <div className="font-display font-semibold text-base" style={{ color: 'var(--v-text)' }}>{profile?.name || 'Organizer profile'}</div>
              <p className="text-xs font-body" style={{ color: 'var(--v-muted)' }}>{profile?.type || 'Organizer'}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm font-body">
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--v-muted)' }}>Events Posted</span>
              <span style={{ color: 'var(--v-text)' }}>{data?.stats.totalEvents || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--v-muted)' }}>Featured</span>
              <span style={{ color: 'var(--v-text)' }}>{data?.stats.featuredCount || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--v-muted)' }}>Capacity</span>
              <span style={{ color: 'var(--v-text)' }}>{data?.stats.totalCapacity || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--v-muted)' }}>Fill Rate</span>
              <span style={{ color: 'var(--v-text)' }}>{data?.stats.fillRate || 0}%</span>
            </div>
          </div>

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--v-border)' }}>
            <Link href="/organizers/settings" className="btn-pri w-full px-6 py-3 text-sm">
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
    }
