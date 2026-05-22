'use client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EventCard } from '@/components/EventCard'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { Footer } from '@/components/Footer'
import { getEventById, getOrganizerForEvent, getEventsByOrganizer, CATEGORY_META, FORMAT_META } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

const IMG_BG: Record<string, string> = {
  tech:      'ev-img ev-img-tech',
  design:    'ev-img ev-img-design',
  startup:   'ev-img ev-img-startup',
  career:    'ev-img ev-img-career',
  community: 'ev-img ev-img-community',
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = getEventById(params.id)
  if (!event) notFound()

  const organizer  = getOrganizerForEvent(event)
  const moreEvents = getEventsByOrganizer(event.organizerId).filter(e => e.id !== event.id).slice(0, 3)
  const isFree     = event.price === 'Free' || event.price === 0
  const cat        = CATEGORY_META[event.category]
  const fmt        = FORMAT_META[event.format]
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>('.sr')
    els.forEach(el => gsap.from(el, {
      opacity: 0, y: 22, duration: 0.65, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    }))
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div className="min-h-screen">

      {/* Back */}
      <div className="container-page pt-24 pb-4">
        <Link href="/events" className="inline-flex items-center gap-2 text-sm font-body transition-colors"
          style={{ color: 'rgba(240,234,255,0.32)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Events
        </Link>
      </div>

      <div className="container-page pb-16">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12">

          {/* ── LEFT ─────────────────────────────────────────── */}
          <div>
            {/* Event image — rich gradient, no placeholder text */}
            {/* REPLACE: swap the div below with an <img> tag once you have a real photo */}
            {/* Photo to find: search Pinterest for → {event.photoQuery} */}
            <div className={`sr ${IMG_BG[event.category]} w-full rounded-3xl mb-8 relative overflow-hidden`}
              style={{ height: '360px' }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,7,25,0.6) 0%, transparent 60%)' }} />
              <span className="photo-hint">📸 add photo</span>
              {/* Pinterest search hint — only visible in code */}
              {/* {event.photoQuery} */}
            </div>

            {/* Tags + actions */}
            <div className="sr flex flex-wrap items-center gap-2.5 mb-5">
              <span className={`tag ${cat.tagClass}`}>{cat.emoji} {cat.label}</span>
              <span className="text-xs font-body px-2.5 py-1 rounded-full" style={{ background: 'rgba(196,181,253,0.1)', color: 'rgba(240,234,255,0.4)' }}>
                {fmt.label}
              </span>
              {event.badge === 'featured' && (
                <span className="text-xs font-body px-3 py-1 rounded-full" style={{ background: 'rgba(123,63,228,0.2)', color: '#C4B5FD' }}>
                  Featured
                </span>
              )}
              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => { if (navigator.share) navigator.share({ title: event.title, url: window.location.href }) }}
                  className="btn-ghost px-3.5 py-2 text-xs gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  Share
                </button>
                <button onClick={() => setBookmarked(b => !b)}
                  className="btn-ghost px-3.5 py-2 text-xs gap-1.5"
                  style={{ color: bookmarked ? '#7B3FE4' : undefined, borderColor: bookmarked ? 'rgba(123,63,228,0.4)' : undefined }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                  {bookmarked ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="sr h-xl mb-6" style={{ color: '#F0EAFF' }}>{event.title}</h1>

            {/* Meta */}
            <div className="sr flex flex-wrap gap-5 mb-8 pb-8" style={{ borderBottom: '1px solid rgba(196,181,253,0.07)' }}>
              {[
                { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, text: event.date },
                { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, text: event.time },
                { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, text: event.location },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm font-body" style={{ color: 'rgba(240,234,255,0.4)' }}>
                  <span style={{ color: '#7B3FE4' }}>{icon}</span>{text}
                </div>
              ))}
            </div>

            {/* About */}
            <div className="sr mb-10">
              <h2 className="h-md mb-5" style={{ color: '#F0EAFF' }}>About this event</h2>
              {event.longDesc.split('\n\n').map((p, i) => (
                <p key={i} className="font-body text-sm leading-[1.9] mb-4" style={{ color: 'rgba(240,234,255,0.40)' }}>{p}</p>
              ))}
            </div>

            {/* Speakers */}
            {event.speakers.length > 0 && (
              <div className="sr mb-10">
                <h2 className="h-md mb-6" style={{ color: '#F0EAFF' }}>Speakers</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.speakers.map(s => (
                    <div key={s.name} className="gcard rounded-2xl p-5 text-center">
                      {/* REPLACE: swap div below with <img> once you have speaker headshots */}
                      {/* Download from: LinkedIn or speaker bio pages */}
                      <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center font-display font-bold text-base ${s.color}`}
                        style={{ color: '#C4B5FD', border: '1px solid rgba(196,181,253,0.12)' }}>
                        {s.initials}
                      </div>
                      <div className="font-display font-semibold text-sm mb-0.5" style={{ color: '#F0EAFF' }}>{s.name}</div>
                      <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.28)' }}>{s.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* More events */}
            {moreEvents.length > 0 && (
              <div className="sr">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="h-md" style={{ color: '#F0EAFF' }}>More from {organizer?.name}</h2>
                  {organizer && (
                    <Link href={`/organizers/${organizer.id}`} className="text-xs font-body flex items-center gap-1 transition-colors" style={{ color: '#C4B5FD' }}>
                      View all <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {moreEvents.map(ev => <EventCard key={ev.id} event={ev} />)}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ────────────────────────────────── */}
          <div className="space-y-4">
            <div className="sr gcard rounded-3xl p-7 anim-border sticky top-24">

              {/* Price */}
              <div className="mb-5">
                <div className="text-xs font-body mb-1" style={{ color: 'rgba(240,234,255,0.26)' }}>Ticket price</div>
                <div className="font-display font-bold" style={{ fontSize: '2.4rem', color: isFree ? '#34d399' : '#F0EAFF', lineHeight: 1.1 }}>
                  {isFree ? 'Free' : `₦${(event.price as number).toLocaleString()}`}
                </div>
                {!isFree && <div className="text-xs font-body mt-1" style={{ color: 'rgba(240,234,255,0.26)' }}>Standard entry</div>}
              </div>

              {/* Availability */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-body mb-2">
                  <span style={{ color: 'rgba(240,234,255,0.32)' }}>Availability</span>
                  <span className="font-semibold" style={{ color: '#C4B5FD' }}>{event.filled}% filled</span>
                </div>
                <div className="prog-bar"><div className="prog-fill" style={{ width: `${event.filled}%` }} /></div>
                <div className="text-xs font-body mt-1.5" style={{ color: 'rgba(240,234,255,0.2)' }}>
                  ~{Math.floor(event.capacity * (1 - event.filled / 100))} spots remaining
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3.5 mb-7 pb-7" style={{ borderBottom: '1px solid rgba(196,181,253,0.07)' }}>
                {[
                  { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label:'Date',     val: event.date },
                  { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label:'Time',     val: event.time },
                  { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label:'Location', val: event.location },
                ].map(({ icon, label, val }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(255,255,255,0.04)', color: '#7B3FE4' }}>{icon}</div>
                    <div>
                      <div className="text-xs font-body mb-0.5" style={{ color: 'rgba(240,234,255,0.26)' }}>{label}</div>
                      <div className="text-sm font-body font-medium" style={{ color: '#F0EAFF' }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a href="#" target="_blank" rel="noopener noreferrer"
                className="btn-pri w-full text-white font-semibold py-4 rounded-2xl text-base mb-3">
                {isFree ? 'Register Now' : 'Get Tickets'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
              <p className="text-center font-body mb-3" style={{ fontSize: '0.58rem', color: 'rgba(240,234,255,0.16)' }}>
                Opens external registration. Verivent doesn&apos;t handle payments.
              </p>
              <button onClick={() => setBookmarked(b => !b)}
                className="btn-ghost w-full py-3.5 rounded-2xl text-sm"
                style={{ color: bookmarked ? '#7B3FE4' : undefined, borderColor: bookmarked ? 'rgba(123,63,228,0.4)' : undefined }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                {bookmarked ? 'Event Saved' : 'Save Event'}
              </button>
            </div>

            {/* Organizer mini card */}
            {organizer && (
              <div className="sr gcard rounded-2xl p-5">
                <div className="text-xs font-body mb-3" style={{ color: 'rgba(240,234,255,0.22)' }}>Organized by</div>
                <Link href={`/organizers/${organizer.id}`} className="flex items-center gap-3 group">
                  <div className={`w-11 h-11 rounded-xl ${organizer.avatarColor} flex items-center justify-center font-display font-bold text-xs flex-shrink-0`}
                    style={{ color: '#C4B5FD', border: '1px solid rgba(196,181,253,0.1)' }}>
                    {organizer.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-display font-semibold text-sm group-hover:text-lavender transition-colors" style={{ color: '#F0EAFF' }}>
                        {organizer.name}
                      </span>
                      <VerifiedBadge size={13} />
                    </div>
                    <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.24)' }}>{organizer.eventsCount} verified events</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(196,181,253,0.2)' }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
