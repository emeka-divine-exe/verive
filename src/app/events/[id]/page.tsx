'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { EventCard } from '@/components/EventCard'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { ReviewForm } from '@/components/ReviewForm'
import { Footer } from '@/components/Footer'
import { getEventById, getEventsByOrganizer, getOrganizerById } from '@/lib/supabase/queries'
import { CATEGORY_META, FORMAT_META, type Event, type Organizer } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event,      setEvent]      = useState<Event | null>(null)
  const [organizer,  setOrganizer]  = useState<Organizer | null>(null)
  const [moreEvents, setMoreEvents] = useState<Event[]>([])
  const [bookmarked, setBookmarked] = useState(false)
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const currentEvent = await getEventById(params.id)
      if (!mounted) return
      if (!currentEvent) { setLoading(false); return }
      setEvent(currentEvent)
      const [org, others] = await Promise.all([
        getOrganizerById(currentEvent.organizerId),
        getEventsByOrganizer(currentEvent.organizerId),
      ])
      if (!mounted) return
      setOrganizer(org)
      setMoreEvents(others.filter(item => item.id !== currentEvent.id).slice(0, 3))
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [params.id])

  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>('.sr')
    els.forEach(el =>
      gsap.from(el, {
        opacity: 0, y: 22, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      }),
    )
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [event])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8 rounded-full border-2"
          style={{ borderColor: 'rgba(194,130,13,0.2)', borderTopColor: '#C2820D' }} />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="gcard rounded-2xl p-8 text-center max-w-md">
          <h1 className="h-md mb-2" style={{ color: '#F0E8D6' }}>Event not found</h1>
          <p className="font-body text-sm" style={{ color: 'rgba(240,232,214,0.35)' }}>
            The event may have been removed or is still unpublished.
          </p>
          <Link href="/events" className="btn-pri inline-flex px-6 py-3 text-sm mt-5">
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const cat    = CATEGORY_META[event.category]
  const fmt    = FORMAT_META[event.format]
  const isFree = event.price === 'Free' || event.price === 0

  return (
    <div className="min-h-screen">
      <div className="container-page pt-24 pb-4">
        <Link href="/events"
          className="inline-flex items-center gap-2 text-sm font-body transition-colors"
          style={{ color: 'rgba(240,232,214,0.32)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to Events
        </Link>
      </div>

      <div className="container-page pb-16">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12">

          {/* ── Left column ── */}
          <div>
            {/* Banner */}
            <div
              className={`sr ev-img ev-img-${event.category} w-full rounded-3xl mb-8 relative overflow-hidden`}
              style={{ height: '360px' }}>
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(6,9,26,0.6) 0%, transparent 60%)' }} />
              {event.imageUrl && (
                <img src={event.imageUrl} alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover" />
              )}
            </div>

            {/* Tags */}
            <div className="sr flex flex-wrap items-center gap-2.5 mb-5">
              <span className={`tag ${cat.tagClass}`}>{cat.emoji} {cat.label}</span>
              <span className="text-xs font-body px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(240,232,214,0.08)', color: 'rgba(240,232,214,0.44)' }}>
                {fmt.label}
              </span>
              {event.badge === 'featured' && (
                <span className="text-xs font-body px-3 py-1 rounded-full"
                  style={{ background: 'rgba(194,130,13,0.16)', color: '#D4970F' }}>
                  Featured
                </span>
              )}
              <span className="text-xs font-body px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(240,232,214,0.34)' }}>
                {isFree ? 'Free' : `₦${Number(event.price).toLocaleString()}`}
              </span>
            </div>

            <h1 className="sr h-xl mb-4" style={{ color: '#F0E8D6' }}>{event.title}</h1>

            <div className="sr flex flex-wrap gap-4 text-sm font-body mb-8"
              style={{ color: 'rgba(240,232,214,0.34)' }}>
              <span>{event.date}</span>
              <span>{event.time}</span>
              <span>{event.location}</span>
            </div>

            <div className="sr">
              <p className="font-body text-base leading-relaxed"
                style={{ color: 'rgba(240,232,214,0.38)' }}>
                {event.longDesc || event.description}
              </p>
            </div>

            {/* More from organizer */}
            <div className="sr mt-12">
              <h2 className="h-md mb-4" style={{ color: '#F0E8D6' }}>More from this organizer</h2>
              {moreEvents.length === 0 ? (
                <div className="gcard rounded-2xl p-8">
                  <p className="font-body text-sm" style={{ color: 'rgba(240,232,214,0.32)' }}>
                    No additional published events yet.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {moreEvents.map(item => (
                    <EventCard key={item.id} event={item} showOrganizer={false} />
                  ))}
                </div>
              )}
            </div>

            {/* ── Review Form — algorithm entry point ── */}
            <ReviewForm eventId={event.id} />
          </div>

          {/* ── Right sidebar ── */}
          <aside className="space-y-5">

            {/* Organizer card */}
            <div className="gcard rounded-2xl p-5">
              <h2 className="h-md mb-4" style={{ color: '#F0E8D6' }}>Organizer</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-sm"
                  style={{ background: organizer?.avatarColor || 'rgba(194,130,13,0.16)', color: '#D4970F' }}>
                  {organizer?.initials || 'OR'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-semibold text-sm" style={{ color: '#F0E8D6' }}>
                      {organizer?.name || event.organizer}
                    </span>
                    {organizer?.verified && <VerifiedBadge size={14} />}
                  </div>
                  <p className="text-xs font-body" style={{ color: 'rgba(240,232,214,0.32)' }}>
                    {organizer?.type || 'Organizer'}
                  </p>
                </div>
              </div>
              <p className="font-body text-sm leading-relaxed mb-4"
                style={{ color: 'rgba(240,232,214,0.38)' }}>
                {organizer?.bio || ''}
              </p>
              {organizer?.website && (
                <a href={organizer.website} target="_blank" rel="noreferrer"
                  className="text-sm font-body transition-colors"
                  style={{ color: '#C2820D' }}>
                  Visit website →
                </a>
              )}
            </div>

            {/* Event facts */}
            <div className="gcard rounded-2xl p-5">
              <h2 className="h-md mb-4" style={{ color: '#F0E8D6' }}>Event details</h2>
              <div className="space-y-3 text-sm font-body">
                {[
                  { label: 'Category', val: cat.label },
                  { label: 'Format',   val: fmt.label },
                  { label: 'Capacity', val: event.capacity || '—' },
                  { label: 'Filled',   val: event.filled || 0 },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span style={{ color: 'rgba(240,232,214,0.34)' }}>{label}</span>
                    <span style={{ color: '#F0E8D6' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="gcard rounded-2xl p-5">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: event.title, url: window.location.href })
                  }
                }}
                className="btn-pri w-full px-5 py-3 text-sm">
                Share Event
              </button>
              <button
                onClick={() => setBookmarked(v => !v)}
                className="btn-ghost w-full mt-3 px-5 py-3 text-sm">
                {bookmarked ? '✓ Bookmarked' : 'Bookmark Event'}
              </button>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
              }
