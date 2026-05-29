'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { EventCard } from '@/components/EventCard'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { Footer } from '@/components/Footer'
import { CATEGORY_META, type Event, type Organizer } from '@/lib/data'
import { getEventsByOrganizer, getOrganizerById } from '@/lib/supabase/queries'

gsap.registerPlugin(ScrollTrigger)

export default function OrganizerProfilePage({ params }: { params: { id: string } }) {
  const [organizer, setOrganizer] = useState<Organizer | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      const org = await getOrganizerById(params.id)
      if (!mounted) return
      if (!org) {
        setLoading(false)
        return
      }

      setOrganizer(org)
      const publishedEvents = await getEventsByOrganizer(params.id)
      if (!mounted) return
      setEvents(publishedEvents)
      setLoading(false)
    }

    load()
    return () => {
      mounted = false
    }
  }, [params.id])

  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>('.sr')
    els.forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 22,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      })
    })
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [organizer])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8" />
      </div>
    )
  }

  if (!organizer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="gcard rounded-2xl p-8 text-center max-w-md">
          <h1 className="h-md mb-2" style={{ color: '#F0EAFF' }}>Organizer not found</h1>
          <p className="font-body text-sm" style={{ color: 'rgba(240,234,255,0.35)' }}>
            The organizer profile is not available yet.
          </p>
          <Link href="/organizers" className="btn-pri inline-flex text-white font-semibold px-6 py-3 text-sm mt-5">
            Back to Organizers
          </Link>
        </div>
      </div>
    )
  }

  const topCategories = Array.from(new Set(events.map((event) => event.category))).slice(0, 5)

  return (
    <div className="min-h-screen">
      <div
        className="w-full relative overflow-hidden mt-[66px]"
        style={{
          height: '260px',
          background: organizer.coverColor,
        }}
      >
        {organizer.coverUrl && (
          <img
            src={organizer.coverUrl}
            alt={`${organizer.name} cover`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,7,25,0.7) 0%, transparent 60%)' }} />
      </div>

      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 -mt-10 mb-10 relative z-10">
          <div className="flex items-end gap-5">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center font-display font-bold text-2xl flex-shrink-0 glow ring-4"
              style={{
                background: organizer.avatarColor,
                color: '#C4B5FD',
                border: '1px solid rgba(196,181,253,0.12)',
                boxShadow: '0 0 0 4px #0D0719',
              }}
            >
              {organizer.avatarUrl ? (
                <img src={organizer.avatarUrl} alt={organizer.name} className="w-full h-full object-cover rounded-3xl" />
              ) : (
                organizer.initials
              )}
            </div>

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h1 className="font-display font-bold text-3xl" style={{ color: '#F0EAFF', letterSpacing: '-0.02em' }}>
                  {organizer.name}
                </h1>
                {organizer.verified && <VerifiedBadge size={13} />}
              </div>

              <p className="font-body text-sm" style={{ color: 'rgba(240,234,255,0.36)' }}>
                {organizer.type} · Lagos, Nigeria
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-1">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: organizer.name, url: window.location.href })
                }
              }}
              className="btn-ghost px-5 py-2.5 text-sm"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              <span className="ml-2">Share</span>
            </button>

            <Link href="/organizers/apply" className="btn-pri text-white font-semibold px-6 py-2.5 text-sm">
              Verify Organizer
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            { v: (organizer.eventsCount || 0).toString(), l: 'Events Hosted' },
{ v: organizer.attendees || '0', l: 'Total Attendees' },
{ v: `${organizer.rating || 0} ★`, l: 'Avg. Rating' },
{ v: (organizer.since || new Date().getFullYear()).toString(), l: 'Member Since' },
          ].map(({ v, l }) => (
            <div key={l} className="gcard rounded-2xl p-5 text-center">
              <div className="font-display font-bold mb-1" style={{ color: '#F0EAFF', fontSize: '1.5rem' }}>{v}</div>
              <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.28)' }}>{l}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-12 pb-24">
          <div className="sr">
            <h2 className="h-md mb-4" style={{ color: '#F0EAFF' }}>About</h2>
            <p className="font-body text-sm leading-relaxed mb-5" style={{ color: 'rgba(240,234,255,0.38)' }}>{organizer.longBio}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {organizer.categories.map((cat) => (
                <span key={cat} className={`tag ${CATEGORY_META[cat].tagClass}`}>{CATEGORY_META[cat].label}</span>
              ))}
            </div>

            <div className="space-y-3 mb-7">
              {[
                { icon: '🌐', label: organizer.website, href: organizer.website },
                { icon: '𝕏', label: organizer.twitter, href: organizer.twitter ? `https://x.com/${organizer.twitter.replace('@', '')}` : '' },
                { icon: '◎', label: organizer.instagram, href: organizer.instagram ? `https://instagram.com/${organizer.instagram.replace('@', '')}` : '' },
              ].filter((item) => item.label).map((item) => (
                <a
                  key={item.icon + item.label}
                  href={item.href || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 transition-colors"
                  style={{ color: 'rgba(240,234,255,0.30)' }}
                >
                  <span style={{ color: '#7B3FE4' }}>{item.icon}</span>
                  <span className="text-sm font-body">{item.label}</span>
                </a>
              ))}
            </div>

            <div className="gcard rounded-2xl p-5" style={{ border: '1px solid rgba(123,63,228,0.18)' }}>
              <p className="text-xs font-body leading-relaxed mb-4" style={{ color: 'rgba(240,234,255,0.36)' }}>
                Want to become a verified organizer on Verivent?
              </p>
              <Link href="/organizers/apply" className="btn-pri text-white text-xs font-semibold px-5 py-2.5 w-full justify-center">
                Apply Now
              </Link>
            </div>
          </div>

          <div>
            <div className="sr mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="h-md" style={{ color: '#F0EAFF' }}>Upcoming Events</h2>
                <span className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.26)' }}>{events.length} listed</span>
              </div>

              {events.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {events.map((ev) => <EventCard key={ev.id} event={ev} showOrganizer={false} />)}
                </div>
              ) : (
                <div className="gcard rounded-2xl p-8 text-center">
                  <p className="text-sm font-body" style={{ color: 'rgba(240,234,255,0.28)' }}>No upcoming events listed yet.</p>
                </div>
              )}
            </div>

            <div className="sr">
              <h2 className="h-md mb-6" style={{ color: '#F0EAFF' }}>Categories</h2>
              <div className="flex flex-wrap gap-3">
                {topCategories.map((category) => (
                  <span key={category} className={`tag ${CATEGORY_META[category].tagClass}`}>
                    {CATEGORY_META[category].emoji} {CATEGORY_META[category].label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
