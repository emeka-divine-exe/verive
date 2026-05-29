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

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description?: string }) {
  return (
    <div className="mb-8">
      <div className="sec-label sec-label-left sr"><span>{eyebrow}</span></div>
      <h2 className="sr h-xl" style={{ color: '#F0EAFF' }}>{title}</h2>
      {description && (
        <p className="sr mt-3 font-body text-base max-w-2xl" style={{ color: 'rgba(240,234,255,0.38)' }}>
          {description}
        </p>
      )}
    </div>
  )
}

export default function LandingPage() {
  const headRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const featuredGridRef = useRef<HTMLDivElement>(null)

  const [featured, setFeatured] = useState<Event[]>([])
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.08 })
    tl.from(headRef.current, { opacity: 0, y: 36, duration: 0.75, ease: 'power3.out' })
      .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.55, ease: 'power3.out' }, '-=0.4')
      .from(featuredGridRef.current, { opacity: 0, x: 28, duration: 0.7, ease: 'power3.out' }, '-=0.42')
  }, [])

  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>('.sr')
    els.forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 28,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 91%', once: true },
      })
    })
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
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
    return () => {
      mounted = false
    }
  }, [])

  const topCategories = useMemo(() => {
    const counts = new Map<Category, number>()
    for (const organizer of organizers) {
      for (const cat of organizer.categories) {
        counts.set(cat, (counts.get(cat) || 0) + 1)
      }
    }
    return CATEGORY_ORDER.map((category) => ({
      category,
      count: counts.get(category) || 0,
      meta: CATEGORY_META[category],
    }))
  }, [organizers])

  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden grid-bg">
        <div className="orb w-[480px] h-[480px] -left-36 top-12" style={{ background: 'rgba(123,63,228,0.2)' }} />
        <div className="orb w-72 h-72 right-0 bottom-20" style={{ background: 'rgba(196,181,253,0.06)' }} />

        <div className="container-page w-full py-20 relative z-10">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-center">
            <div ref={headRef}>
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full" style={{ background: 'rgba(123,63,228,0.12)', border: '1px solid rgba(196,181,253,0.18)' }}>
                <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#7B3FE4' }} />
                <span className="text-[0.68rem] font-body font-semibold tracking-wide" style={{ color: '#C4B5FD' }}>
                  {organizers.length || 0}+ verified organizers · {featured.length || 0}+ featured events
                </span>
              </div>

              <h1 className="h-hero mb-6 max-w-[560px]" style={{ color: '#F0EAFF' }}>
                The home of<br />
                verified tech events<br />
                in <span className="gradient-text">Africa.</span>
              </h1>

              <p className="font-body text-lg leading-relaxed mb-10 max-w-[440px]" style={{ color: 'rgba(240,234,255,0.42)', fontSize: '1.05rem' }}>
                Verivent now loads its discovery and organizer content directly from Supabase.
                The homepage will populate as your database grows.
              </p>

              <div ref={ctaRef} className="flex flex-wrap gap-4 mb-12">
                <Link href="/events" className="btn-pri text-white font-semibold px-8 py-4 text-base">Browse Events</Link>
                <Link href="/organizers" className="btn-ghost px-8 py-4 text-base">Explore Organizers</Link>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {organizers.slice(0, 4).map((org, i) => (
                    <div
                      key={org.id}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[0.55rem] font-display font-bold flex-shrink-0"
                      style={{
                        background: org.avatarColor,
                        color: '#C4B5FD',
                        zIndex: 4 - i,
                        marginLeft: i === 0 ? 0 : '-10px',
                        boxShadow: '0 0 0 2px #0D0719',
                      }}
                    >
                      {org.initials.charAt(0)}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-sm font-body font-semibold" style={{ color: '#F0EAFF' }}>Trusted by real organizers</div>
                  <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.32)' }}>GDG · Design Week NG · Startup Grind · i4G</div>
                </div>
              </div>
            </div>

            <div ref={featuredGridRef} className="hidden lg:grid grid-cols-2 grid-rows-[200px_160px] gap-3 relative">
              {loading ? (
                <div className="row-span-2 gcard rounded-2xl p-8 flex items-center justify-center">
                  <div className="spinner w-8 h-8" />
                </div>
              ) : featured.length === 0 ? (
                <div className="row-span-2 gcard rounded-2xl p-8 flex items-center justify-center">
                  <p className="font-body text-sm text-center" style={{ color: 'rgba(240,234,255,0.4)' }}>
                    Add events in Supabase to populate this section.
                  </p>
                </div>
              ) : (
                <>
                  <div className="row-span-2">
                    <EventCard event={featured[0]} variant="featured" />
                  </div>
                  {featured[1] && <EventCard event={featured[1]} />}
                  {featured[2] && <EventCard event={featured[2]} />}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="py-6 overflow-hidden border-y border-white/[0.05]">
        <div className="marquee-inner">
          {['Google Developer Groups', 'Startup Grind Lagos', 'Design Week Nigeria', 'TechPoint Africa', 'Ingressive for Good', 'ALX Africa', 'Creative Morning Lagos', 'HNG Internship'].map((name, i) => (
            <span key={`${name}-${i}`} className="inline-flex items-center gap-10">
              <span className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.2)' }}>{name}</span>
              <span style={{ color: 'rgba(123,63,228,0.3)', fontSize: '0.65rem' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      <section className="py-24 relative overflow-hidden">
        <div className="orb w-96 h-96 right-0 top-0 translate-x-1/3" style={{ background: 'rgba(123,63,228,0.08)' }} />
        <div className="container-page relative z-10">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-start">
            <div className="sr">
              <div className="sec-label sec-label-left"><span>The Problem</span></div>
              <h2 className="h-xl mb-6" style={{ color: '#F0EAFF' }}>
                You shouldn&apos;t hear<br />about great events<br />
                <span className="gradient-text">after they happen.</span>
              </h2>
              <p className="font-body text-lg leading-relaxed max-w-md" style={{ color: 'rgba(240,234,255,0.38)', fontSize: '1rem' }}>
                The current event ecosystem is fragmented. Verivent solves discovery using real data from Supabase instead of static local arrays.
              </p>
            </div>

            <div className="space-y-4">
              <div className="sr gcard rounded-2xl p-7">
                <div className="text-2xl mb-4">📡</div>
                <h3 className="h-md mb-2" style={{ color: '#F0EAFF' }}>Database-driven discovery</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(240,234,255,0.36)' }}>
                  Your homepage and feed now respond to the contents of your Supabase database.
                </p>
              </div>

              <div className="sr grid grid-cols-2 gap-4">
                <div className="gcard rounded-2xl p-5">
                  <div className="text-2xl mb-3">🔇</div>
                  <h3 className="font-display font-semibold text-sm mb-1.5" style={{ color: '#F0EAFF', letterSpacing: '-0.01em' }}>No mock data dependency</h3>
                  <p className="font-body text-xs leading-relaxed" style={{ color: 'rgba(240,234,255,0.34)' }}>The app now reads from the backend layer.</p>
                </div>
                <div className="gcard rounded-2xl p-5">
                  <div className="text-2xl mb-3">⏰</div>
                  <h3 className="font-display font-semibold text-sm mb-1.5" style={{ color: '#F0EAFF', letterSpacing: '-0.01em' }}>Scalable structure</h3>
                  <p className="font-body text-xs leading-relaxed" style={{ color: 'rgba(240,234,255,0.34)' }}>As you seed the database, the UI fills itself automatically.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="container-page">
          <SectionTitle
            eyebrow="Featured Events"
            title={<>Latest from <span className="gradient-text">Supabase.</span></>}
            description="When events exist in your database, this section becomes the visual engine of the homepage."
          />

          {loading ? (
            <div className="gcard rounded-2xl p-10 flex justify-center">
              <div className="spinner w-8 h-8" />
            </div>
          ) : featured.length === 0 ? (
            <div className="gcard rounded-2xl p-10 text-center">
              <p className="font-body text-sm" style={{ color: 'rgba(240,234,255,0.35)' }}>
                No events have been added yet. Populate Supabase to make this section live.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5 mb-5">
              <div><EventCard event={featured[0]} variant="featured" /></div>
              <div className="grid grid-rows-2 gap-5">
                <div>{featured[1] && <EventCard event={featured[1]} />}</div>
                <div>{featured[2] && <EventCard event={featured[2]} />}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-24 relative">
        <div className="orb w-80 h-80 right-0 translate-x-1/3" style={{ background: 'rgba(123,63,228,0.09)' }} />
        <div className="container-page relative z-10">
          <SectionTitle
            eyebrow="Categories"
            title={<>Find your <span className="gradient-text">ecosystem.</span></>}
            description="The database can power category discovery, featured curation, and smart organizer grouping."
          />

          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
            {topCategories.map(({ category, count, meta }) => (
              <Link key={category} href={`/events?category=${category}`} className="gcard rounded-2xl p-5 block">
                <div className="text-3xl mb-3">{meta.emoji}</div>
                <div className="font-display font-semibold text-sm mb-1" style={{ color: '#F0EAFF' }}>{meta.label}</div>
                <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.28)' }}>{count} organizer groups</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="container-page">
          <SectionTitle
            eyebrow="Verified Organizers"
            title={<>Events from people <span className="gradient-text">you can trust.</span></>}
            description="Organizer cards now come from Supabase profile rows and published event counts."
          />

          {organizers.length === 0 ? (
            <div className="gcard rounded-2xl p-10 text-center">
              <p className="font-body text-sm" style={{ color: 'rgba(240,234,255,0.35)' }}>
                No organizers found yet. Add organizer profiles in Supabase to populate this section.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-5">
              {organizers.slice(0, 4).map((org) => (
                <Link key={org.id} href={`/organizers/${org.id}`} className="gcard rounded-2xl p-5 flex items-center gap-4 group block">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-sm flex-shrink-0" style={{ background: org.avatarColor, color: '#C4B5FD' }}>
                    {org.initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-display font-semibold text-sm" style={{ color: '#F0EAFF' }}>{org.name}</span>
                      {org.verified && <VerifiedBadge size={14} />}
                    </div>
                    <p className="text-xs font-body truncate" style={{ color: 'rgba(240,234,255,0.3)' }}>
                      {org.type} · {org.eventsCount} events · {org.attendees} attendees
                    </p>
                  </div>

                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0" style={{ color: 'rgba(196,181,253,0.25)' }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-28 relative overflow-hidden">
        <div className="orb w-[600px] h-[600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: 'rgba(123,63,228,0.14)' }} />
        <div className="container-page relative z-10 text-center">
          <div className="sr max-w-3xl mx-auto">
            <div className="text-[0.67rem] font-body font-bold uppercase tracking-widest mb-6 block" style={{ color: '#7B3FE4' }}>
              Never Miss What Matters
            </div>
            <h2 className="h-xl mb-6" style={{ color: '#F0EAFF' }}>
              Be first.<br /><span className="gradient-text">Stay ahead.</span>
            </h2>
            <p className="font-body text-lg mb-12 max-w-md mx-auto" style={{ color: 'rgba(240,234,255,0.38)', fontSize: '1rem' }}>
              Populate your database with real organizers and events, and Verivent will become a live discovery engine.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/events" className="btn-pri text-white font-semibold px-10 py-4 text-base">Start Discovering</Link>
              <Link href="/organizers/dashboard" className="btn-ghost px-8 py-4 text-base">Organizer Dashboard</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
