'use client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EventCard } from '@/components/EventCard'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { Footer } from '@/components/Footer'
import { getOrganizerById, getEventsByOrganizer, CATEGORY_META } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

const PAST = [
  { title: 'Lagos Dev Summit 2024',          date: 'Oct 2024', attendees: '850'   },
  { title: 'Google I/O Extended Lagos 2024',  date: 'May 2024', attendees: '1,200' },
  { title: 'GDG DevFest Lagos 2023',          date: 'Nov 2023', attendees: '1,500' },
]

export default function OrganizerProfilePage({ params }: { params: { id: string } }) {
  const org = getOrganizerById(params.id)
  if (!org) notFound()

  const upcomingEvents = getEventsByOrganizer(org.id)

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

      {/* Cover — REPLACE with real photo. Search Pinterest → {org.coverQuery} */}
      <div className={`w-full bg-gradient-to-r ${org.coverColor} relative overflow-hidden mt-[66px]`} style={{ height: '260px' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,7,25,0.7) 0%, transparent 60%)' }} />
        <span className="photo-hint">📸 cover photo</span>
      </div>

      <div className="container-page">

        {/* Profile head */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 -mt-10 mb-10 relative z-10">
          <div className="flex items-end gap-5">
            {/* Logo — REPLACE with real logo. Download from {org.website} */}
            <div
  className={`w-24 h-24 rounded-3xl ${org.avatarColor} flex items-center justify-center font-display font-bold text-2xl flex-shrink-0 glow ring-4 ring-[#0D0719]`}
  style={{
    color: '#C4B5FD',
    border: '1px solid rgba(196,181,253,0.12)'
  }}
>
            <div className="pb-1">
              {/* Name + verified badge */}
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h1 className="font-display font-bold text-3xl" style={{ color: '#F0EAFF', letterSpacing: '-0.02em' }}>
                  {org.name}
                </h1>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{ background: 'rgba(123,63,228,0.14)', border: '1px solid rgba(196,181,253,0.2)' }}>
                  <VerifiedBadge size={13} />
                  <span className="text-xs font-body font-semibold" style={{ color: '#C4B5FD' }}>Verified Organizer</span>
                </div>
              </div>
              <p className="font-body text-sm" style={{ color: 'rgba(240,234,255,0.36)' }}>
                {org.type} · Lagos, Nigeria
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-1">
            <button onClick={() => { if (navigator.share) navigator.share({ title: org.name, url: window.location.href }) }}
              className="btn-ghost px-5 py-2.5 text-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              Share
            </button>
            <button className="btn-pri text-white font-semibold px-6 py-2.5 text-sm">Follow</button>
          </div>
        </div>

        {/* Stats */}
        <div className="sr grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            { v: org.eventsCount.toString(), l: 'Events Hosted' },
            { v: org.attendees,               l: 'Total Attendees' },
            { v: `${org.rating} ★`,           l: 'Avg. Rating' },
            { v: org.since.toString(),         l: 'Member Since' },
          ].map(({ v, l }) => (
            <div key={l} className="gcard rounded-2xl p-5 text-center">
              <div className="font-display font-bold mb-1" style={{ color: '#F0EAFF', fontSize: '1.5rem' }}>{v}</div>
              <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.28)' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 pb-24">

          {/* Sidebar */}
          <div className="sr">
            <h2 className="h-md mb-4" style={{ color: '#F0EAFF' }}>About</h2>
            <p className="font-body text-sm leading-relaxed mb-5" style={{ color: 'rgba(240,234,255,0.38)' }}>{org.longBio}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {org.categories.map(cat => (
                <span key={cat} className={`tag ${CATEGORY_META[cat].tagClass}`}>{CATEGORY_META[cat].label}</span>
              ))}
            </div>

            <div className="space-y-3 mb-7">
              {[
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: org.website },
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>, label: org.twitter },
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>, label: org.instagram },
              ].map(({ icon, label }) => (
                <a key={label} href="#" className="flex items-center gap-3 transition-colors"
                  style={{ color: 'rgba(240,234,255,0.30)' }}>
                  <span style={{ color: '#7B3FE4' }}>{icon}</span>
                  <span className="text-sm font-body">{label}</span>
                </a>
              ))}
            </div>

            {/* Apply CTA */}
            <div className="gcard rounded-2xl p-5" style={{ border: '1px solid rgba(123,63,228,0.18)' }}>
              <p className="text-xs font-body leading-relaxed mb-4" style={{ color: 'rgba(240,234,255,0.36)' }}>
                Want to become a verified organizer on Verivent?
              </p>
              <Link href="/apply" className="btn-pri text-white text-xs font-semibold px-5 py-2.5 w-full justify-center">
                Apply Now
              </Link>
            </div>
          </div>

          {/* Events */}
          <div>
            <div className="sr mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="h-md" style={{ color: '#F0EAFF' }}>Upcoming Events</h2>
                <span className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.26)' }}>{upcomingEvents.length} listed</span>
              </div>
              {upcomingEvents.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {upcomingEvents.map(ev => <EventCard key={ev.id} event={ev} showOrganizer={false} />)}
                </div>
              ) : (
                <div className="gcard rounded-2xl p-8 text-center">
                  <p className="text-sm font-body" style={{ color: 'rgba(240,234,255,0.28)' }}>No upcoming events listed yet.</p>
                </div>
              )}
            </div>

            <div className="sr">
              <h2 className="h-md mb-6" style={{ color: '#F0EAFF' }}>Past Events</h2>
              <div className="space-y-3">
                {PAST.map(({ title, date, attendees }) => (
                  <div key={title} className="gcard rounded-2xl p-5 flex items-center gap-5" style={{ opacity: 0.55 }}>
                    {/* REPLACE: small event thumbnail here */}
                    <div className="w-14 h-14 rounded-xl flex-shrink-0 ev-img ev-img-tech" style={{ minWidth: '56px' }} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-sm truncate mb-1" style={{ color: '#F0EAFF' }}>{title}</h3>
                      <p className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.28)' }}>{date} · {attendees} attended</p>
                    </div>
                    <span className="text-xs font-body flex-shrink-0" style={{ color: 'rgba(240,234,255,0.2)' }}>Past</span>
                  </div>
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
