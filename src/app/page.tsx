'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { EventCard } from '@/components/EventCard'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { Footer } from '@/components/Footer'
import { CATEGORY_META, CATEGORY_ORDER, type Category, type Event, type Organizer } from '@/lib/data'
import { getFeaturedEvents, getOrganizers } from '@/lib/supabase/queries'

gsap.registerPlugin(ScrollTrigger)

function SectionLabel({ text, align = 'left', variant = 'gold' }: {
  text: string
  align?: 'left' | 'center'
  variant?: 'gold' | 'teal'
}) {
  return (
    <div className={`sec-label ${align === 'center' ? 'sec-label-center' : 'sec-label-left'} ${variant === 'teal' ? 'sec-label-teal' : ''} sr`}>
      <span>{text}</span>
    </div>
  )
}

function SectionTitle({ eyebrow, title, description, align = 'left', variant = 'gold' }: {
  eyebrow: string
  title: ReactNode
  description?: string
  align?: 'left' | 'center'
  variant?: 'gold' | 'teal'
}) {
  return (
    <div className={`mb-10 ${align === 'center' ? 'text-center' : ''}`}>
      <SectionLabel text={eyebrow} align={align} variant={variant} />
      <h2 className="sr h-xl" style={{ color: 'var(--v-text)' }}>{title}</h2>
      {description && (
        <p className="sr mt-4 font-body text-base leading-relaxed max-w-xl"
          style={{
            color: 'var(--v-muted)',
            ...(align === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } : {})
          }}>
          {description}
        </p>
      )}
    </div>
  )
}

export default function LandingPage() {
  const headRef         = useRef<HTMLDivElement>(null)
  const ctaRef          = useRef<HTMLDivElement>(null)
  const featuredGridRef = useRef<HTMLDivElement>(null)

  const [featured,   setFeatured]   = useState<Event[]>([])
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.08 })
    tl.from(headRef.current,         { opacity: 0, y: 36, duration: 0.75, ease: 'power3.out' })
      .from(ctaRef.current,          { opacity: 0, y: 20, duration: 0.55, ease: 'power3.out' }, '-=0.4')
      .from(featuredGridRef.current, { opacity: 0, x: 28, duration: 0.7,  ease: 'power3.out' }, '-=0.42')
  }, [])

  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>('.sr')
    els.forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 28, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 91%', once: true },
      })
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [featuredEvents, organizerList] = await Promise.all([
          getFeaturedEvents(),
          getOrganizers(),
        ])
        if (!mounted) return
        setFeatured(featuredEvents)
        setOrganizers(organizerList)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const topCategories = useMemo(() => {
    const counts = new Map<Category, number>()
    for (const org of organizers) {
      for (const cat of org.categories || []) {
        counts.set(cat, (counts.get(cat) || 0) + 1)
      }
    }
    return CATEGORY_ORDER.map(category => ({
      category,
      count: counts.get(category) || 0,
      meta:  CATEGORY_META[category],
    }))
  }, [organizers])

  return (
    <div className="overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden grid-bg">
        <div className="orb w-[500px] h-[500px] -left-40 top-10"
          style={{ background: 'rgba(194,130,13,0.10)' }} />
        <div className="orb w-80 h-80 right-0 bottom-20"
          style={{ background: 'rgba(31,122,104,0.07)' }} />

        <div className="container-page w-full py-20 relative z-10">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-center">

            {/* Left — copy */}
            <div ref={headRef}>
              {/* Live pill */}
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(194,130,13,0.10)',
                  border: '1px solid rgba(194,130,13,0.22)',
                }}>
                <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: 'var(--v-gold)' }} />
                <span className="text-[0.68rem] font-body font-semibold tracking-wide"
                  style={{ color: 'var(--v-gold)' }}>
                  {organizers.length > 0
                    ? `${organizers.length}+ verified organizers`
                    : 'Now live in Lagos'} · Trust-first discovery
                </span>
              </div>

              <h1 className="h-hero mb-6 max-w-[560px]" style={{ color: 'var(--v-text)' }}>
                The home of<br />
                verified tech events<br />
                in <span className="gradient-text">Africa.</span>
              </h1>

              <p className="font-body text-lg leading-relaxed mb-10 max-w-[440px]"
                style={{ color: 'var(--v-muted)' }}>
                Stop guessing which events are worth your time. Verive surfaces only what
                the community has verified — through real ratings, real attendance, real trust.
              </p>

              <div ref={ctaRef} className="flex flex-wrap gap-4 mb-12">
                <Link href="/events"     className="btn-pri text-sm px-8 py-4">Browse Events</Link>
                <Link href="/organizers" className="btn-ghost text-sm px-8 py-4">Explore Organizers</Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {organizers.slice(0, 4).map((org, i) => (
                    <div key={org.id}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[0.55rem] font-display font-bold flex-shrink-0"
                      style={{
                        background: org.avatarColor,
                        color:      '#F0E8D6',
                        zIndex:     4 - i,
                        marginLeft: i === 0 ? 0 : '-10px',
                        boxShadow:  '0 0 0 2px var(--v-canvas)',
                      }}>
                      {(org.initials || org.name || 'O').charAt(0)}
                    </div>
                  ))}
                  {organizers.length === 0 && (
                    ['G','D','S','I'].map((l, i) => (
                      <div key={l}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[0.55rem] font-display font-bold flex-shrink-0"
                        style={{
                          background: ['#1F7A68','#C2820D','#185F51','#A06B0A'][i],
                          color:      '#F0E8D6',
                          zIndex:     4 - i,
                          marginLeft: i === 0 ? 0 : '-10px',
                          boxShadow:  '0 0 0 2px var(--v-canvas)',
                        }}>
                        {l}
                      </div>
                    ))
                  )}
                </div>
                <div>
                  <div className="text-sm font-body font-semibold" style={{ color: 'var(--v-text)' }}>
                    Trusted by real organizers
                  </div>
                  <div className="text-xs font-body" style={{ color: 'var(--v-ghost)' }}>
                    GDG Lagos · Design Week NG · Startup Grind · i4G
                  </div>
                </div>
              </div>
            </div>

            {/* Right — featured cards grid */}
            <div ref={featuredGridRef}
              className="hidden lg:grid grid-cols-2 grid-rows-[200px_160px] gap-3 relative">
              {loading ? (
                <div className="col-span-2 row-span-2 gcard rounded-2xl flex items-center justify-center">
                  <div className="spinner w-8 h-8 rounded-full border-2"
                    style={{ borderColor: 'rgba(194,130,13,0.2)', borderTopColor: 'var(--v-gold)' }} />
                </div>
              ) : featured.length === 0 ? (
                <>
                  <div className="row-span-2 gcard-featured rounded-2xl p-6 flex flex-col justify-end ev-img-tech">
                    <div className="tag tag-tech mb-2 self-start">Tech</div>
                    <div className="font-display font-semibold text-sm mb-1" style={{ color: '#F0E8D6' }}>
                      Lagos Dev Summit 2025
                    </div>
                    <div className="text-xs font-body" style={{ color: 'rgba(240,232,214,0.5)' }}>
                      Coming soon · Victoria Island
                    </div>
                  </div>
                  <div className="gcard rounded-2xl p-5 flex flex-col justify-end ev-img-design">
                    <div className="tag tag-design mb-1.5 self-start">Design</div>
                    <div className="font-display font-semibold text-xs" style={{ color: '#F0E8D6' }}>
                      Design Week NG
                    </div>
                  </div>
                  <div className="gcard rounded-2xl p-5 flex flex-col justify-end ev-img-startup">
                    <div className="tag tag-startup mb-1.5 self-start">Startup</div>
                    <div className="font-display font-semibold text-xs" style={{ color: '#F0E8D6' }}>
                      Startup Grind Lagos
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row-span-2"><EventCard event={featured[0]} variant="featured" /></div>
                  {featured[1] && <EventCard event={featured[1]} />}
                  {featured[2] && <EventCard event={featured[2]} />}
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ══ MARQUEE ══════════════════════════════════════════ */}
      <div className="py-5 overflow-hidden border-y" style={{ borderColor: 'var(--v-border)' }}>
        <div className="marquee-inner">
          {[
            'Google Developer Groups','Startup Grind Lagos','Design Week Nigeria',
            'TechPoint Africa','Ingressive for Good','ALX Africa',
            'Creative Mornings Lagos','HNG Internship',
            'Google Developer Groups','Startup Grind Lagos','Design Week Nigeria',
            'TechPoint Africa','Ingressive for Good','ALX Africa',
            'Creative Mornings Lagos','HNG Internship',
          ].map((name, i) => (
            <span key={`${name}-${i}`} className="inline-flex items-center gap-10">
              <span className="text-xs font-body" style={{ color: 'var(--v-ghost)' }}>{name}</span>
              <span style={{ color: 'var(--v-gold)', fontSize: '0.65rem', opacity: 0.5 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ PROBLEM ══════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="orb w-96 h-96 right-0 top-0 translate-x-1/3"
          style={{ background: 'rgba(31,122,104,0.07)' }} />
        <div className="container-page relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionLabel text="The Problem" />
              <h2 className="sr h-xl mb-6" style={{ color: 'var(--v-text)' }}>
                You hear about<br />great events<br />
                <span className="gradient-text">after they happen.</span>
              </h2>
              <p className="sr font-body text-base leading-relaxed max-w-md"
                style={{ color: 'var(--v-muted)' }}>
                The Lagos event ecosystem is noisy. Group chat spam, unverified organisers,
                no way to know if an event is worth your Saturday — until it is too late.
                Verive fixes that.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: '📡', title: 'Too much noise',
                  body: 'Anyone can share an event. Nobody tells you which ones are actually worth showing up for.' },
                { icon: '🔇', title: 'No trust signal',
                  body: 'There is no way to verify an organiser\'s track record before you commit your time.' },
                { icon: '⏰', title: 'Always too late',
                  body: 'The best events sell out before you hear about them. Discovery is broken.' },
              ].map(({ icon, title, body }) => (
                <div key={title} className="sr gcard rounded-2xl p-6 flex gap-4 items-start">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <h3 className="font-display font-semibold text-sm mb-1.5"
                      style={{ color: 'var(--v-text)', letterSpacing: '-0.01em' }}>{title}</h3>
                    <p className="font-body text-sm leading-relaxed"
                      style={{ color: 'var(--v-muted)' }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="orb w-80 h-80 left-0 -translate-x-1/3"
          style={{ background: 'rgba(194,130,13,0.07)' }} />
        <div className="container-page relative z-10">
          <SectionTitle
            eyebrow="How Verive Works"
            title={<>Trust is <span className="gradient-text">earned here.</span></>}
            description="Verive is not a list. It is a reputation system. Every organiser builds credibility event by event."
            align="center"
          />
          <div className="grid md:grid-cols-3 gap-5 mt-12">
            {[
              { step: '01', title: 'Organizers build reputation',
                body: 'Every event is rated across four dimensions — speakers, execution, networking, and value. Ratings are aggregated into a visibility score.',
                color: 'var(--v-gold)' },
              { step: '02', title: 'The badge is earned, not bought',
                body: 'After 20+ events and a sustained 4.5+ rating, organisers earn the Verive verified badge. It is algorithmic. It cannot be purchased.',
                color: 'var(--v-teal-l)' },
              { step: '03', title: 'Discovery reflects reality',
                body: 'Verified organisers surface higher in the feed. The badge can be lost if quality drops. Trust is maintained, not assumed.',
                color: 'var(--v-gold)' },
            ].map(({ step, title, body, color }) => (
              <div key={step} className="sr gcard rounded-2xl p-7">
                <div className="font-display font-bold text-3xl mb-5"
                  style={{ color, opacity: 0.75, letterSpacing: '-0.03em' }}>
                  {step}
                </div>
                <h3 className="font-display font-semibold text-base mb-3"
                  style={{ color: 'var(--v-text)', letterSpacing: '-0.01em' }}>{title}</h3>
                <p className="font-body text-sm leading-relaxed"
                  style={{ color: 'var(--v-muted)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED EVENTS ═══════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="container-page">
          <SectionTitle
            eyebrow="Featured Events"
            title={<>Events worth <span className="gradient-text">showing up for.</span></>}
            description="Curated from verified organisers. Ranked by community trust, not paid placement."
          />
          {loading ? (
            <div className="gcard rounded-2xl p-10 flex justify-center">
              <div className="spinner w-8 h-8 rounded-full border-2"
                style={{ borderColor: 'rgba(194,130,13,0.2)', borderTopColor: 'var(--v-gold)' }} />
            </div>
          ) : featured.length === 0 ? (
            <div className="gcard rounded-2xl p-10 text-center">
              <p className="font-body text-sm" style={{ color: 'var(--v-ghost)' }}>
                Events will appear here once organizers begin publishing.
              </p>
              <Link href="/events" className="inline-block mt-4 btn-pri text-sm px-6 py-2.5">
                Browse All Events
              </Link>
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5 mb-5">
                <div><EventCard event={featured[0]} variant="featured" /></div>
                <div className="grid grid-rows-2 gap-5">
                  <div>{featured[1] && <EventCard event={featured[1]} />}</div>
                  <div>{featured[2] && <EventCard event={featured[2]} />}</div>
                </div>
              </div>
              <div className="text-center mt-8">
                <Link href="/events" className="btn-ghost text-sm px-8 py-3">View All Events</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══ CATEGORIES ════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="orb w-80 h-80 right-0 translate-x-1/3"
          style={{ background: 'rgba(31,122,104,0.07)' }} />
        <div className="container-page relative z-10">
          <SectionTitle
            eyebrow="Categories"
            title={<>Find your <span className="gradient-text-teal">ecosystem.</span></>}
            description="From product and engineering to design and community — Verive covers the full Lagos tech landscape."
            variant="teal"
          />
          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
            {topCategories.map(({ category, count, meta }) => (
              <Link key={category} href={`/events?category=${category}`}
                className="gcard rounded-2xl p-5 block group">
                <div className="text-3xl mb-3">{meta.emoji}</div>
                <div className="font-display font-semibold text-sm mb-1"
                  style={{ color: 'var(--v-text)' }}>{meta.label}</div>
                <div className="text-xs font-body" style={{ color: 'var(--v-ghost)' }}>
                  {count > 0 ? `${count} organizer groups` : 'Explore events'}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VERIFIED ORGANIZERS ═══════════════════════════════ */}
      <section className="py-24 relative">
        <div className="container-page">
          <SectionTitle
            eyebrow="Verified Organizers"
            title={<>Events from people <span className="gradient-text">you can trust.</span></>}
            description="These organisers have earned the Verive badge through consistent quality. The badge is not cosmetic — it is a signal."
          />
          {organizers.length === 0 ? (
            <div className="gcard rounded-2xl p-10 text-center">
              <p className="font-body text-sm mb-4" style={{ color: 'var(--v-ghost)' }}>
                Verified organizers will appear here as they join the platform.
              </p>
              <Link href="/organizer/apply" className="inline-block btn-teal text-sm px-6 py-2.5">
                Apply as Organizer
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-5">
              {organizers.slice(0, 4).map(org => (
                <Link key={org.id} href={`/organizers/${org.id}`}
                  className="gcard rounded-2xl p-5 flex items-center gap-4 block group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                    style={{ background: org.avatarColor, color: '#F0E8D6' }}>
                    {org.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-display font-semibold text-sm"
                        style={{ color: 'var(--v-text)' }}>{org.name}</span>
                      {org.verified && <VerifiedBadge size={14} />}
                    </div>
                    <p className="text-xs font-body truncate" style={{ color: 'var(--v-ghost)' }}>
                      {org.type} · {org.eventsCount} events · {org.attendees} attendees
                    </p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" className="flex-shrink-0"
                    style={{ color: 'var(--v-ghost)' }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="orb w-[600px] h-[600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'rgba(194,130,13,0.08)' }} />
        <div className="orb w-64 h-64 left-0 bottom-0"
          style={{ background: 'rgba(31,122,104,0.06)' }} />
        <div className="container-page relative z-10 text-center">
          <div className="sr max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(194,130,13,0.10)',
                border: '1px solid rgba(194,130,13,0.22)',
              }}>
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--v-gold)' }} />
              <span className="text-[0.68rem] font-body font-semibold"
                style={{ color: 'var(--v-gold)' }}>
                Show up to what matters
              </span>
            </div>
            <h2 className="h-xl mb-6" style={{ color: 'var(--v-text)' }}>
              Stop guessing.<br />
              <span className="gradient-text">Start arriving.</span>
            </h2>
            <p className="font-body text-base leading-relaxed mb-12 max-w-md mx-auto"
              style={{ color: 'var(--v-muted)' }}>
              Join the Lagos tech, design, and startup community that has decided
              their time is worth protecting.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup"          className="btn-pri text-sm px-10 py-4">Create Free Account</Link>
              <Link href="/organizer/apply" className="btn-ghost text-sm px-8 py-4">Apply as Organizer</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
