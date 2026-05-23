'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { VerifiedBadge } from '@/components/VerifiedBadge'

export default function OrganizerDashboardPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      setProfile(prof)
    })
  }, [])

  const name = profile?.full_name || 'Organizer'
  const isVerified = profile?.verified === true

  return (
    <div className="p-6 md:p-10 max-w-5xl">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-body mb-1" style={{ color: 'rgba(240,234,255,0.35)' }}>
          {new Date().toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="h-lg" style={{ color: '#F0EAFF' }}>Welcome, {name.split(' ')[0]}</h1>
          {isVerified && <VerifiedBadge size={22} />}
        </div>
      </div>

      {/* Verified badge request banner */}
      {!isVerified && (
        <div className="gcard rounded-2xl p-6 mb-8 flex items-start gap-5"
          style={{ border: '1px solid rgba(123,63,228,0.3)', background: 'rgba(123,63,228,0.08)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(123,63,228,0.2)', color: '#C4B5FD' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold mb-1" style={{ color: '#F0EAFF', fontSize: '1rem' }}>
              Your account is not yet verified
            </h3>
            <p className="font-body text-sm mb-4" style={{ color: 'rgba(240,234,255,0.4)' }}>
              Get your verified badge to build trust with attendees and unlock full publishing privileges.
            </p>
            <Link href="/organizer/apply" className="btn-pri text-white font-semibold px-6 py-2.5 text-sm">
              Request Verified Badge
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Events Posted',   value: '0' },
          { label: 'Total Views',     value: '0' },
          { label: 'Total Saves',     value: '0' },
          { label: 'Avg. Fill Rate',  value: '—' },
        ].map(({ label, value }) => (
          <div key={label} className="gcard rounded-2xl p-5 text-center">
            <div className="font-display font-bold text-2xl mb-1" style={{ color: '#F0EAFF' }}>{value}</div>
            <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.3)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <h2 className="h-md mb-5" style={{ color: '#F0EAFF' }}>Quick actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/organizer/events/new"
            className="gcard rounded-2xl p-6 flex items-center gap-4 group anim-border">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(123,63,228,0.18)', color: '#C4B5FD' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
            <div>
              <div className="font-display font-semibold mb-0.5" style={{ color: '#F0EAFF', fontSize: '1rem' }}>Post New Event</div>
              <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.32)' }}>Publish your next event listing</div>
            </div>
          </Link>
          <Link href="/organizer/events"
            className="gcard rounded-2xl p-6 flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(123,63,228,0.18)', color: '#C4B5FD' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <div className="font-display font-semibold mb-0.5" style={{ color: '#F0EAFF', fontSize: '1rem' }}>Manage Events</div>
              <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.32)' }}>View and edit your listings</div>
            </div>
          </Link>
        </div>
      </div>

      {/* My events — empty state */}
      <div>
        <h2 className="h-md mb-5" style={{ color: '#F0EAFF' }}>My Events</h2>
        <div className="gcard rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="font-display font-semibold mb-2" style={{ color: '#F0EAFF', fontSize: '1rem' }}>No events posted yet</h3>
          <p className="font-body text-sm mb-6" style={{ color: 'rgba(240,234,255,0.32)' }}>
            Post your first event and start reaching your audience.
          </p>
          <Link href="/organizer/events/new" className="btn-pri text-white font-semibold px-7 py-3 text-sm">
            Post Your First Event
          </Link>
        </div>
      </div>
    </div>
  )
}
