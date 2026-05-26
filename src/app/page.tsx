'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EventCard } from '@/components/EventCard'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { Footer } from '@/components/Footer'
import { CATEGORY_META } from '@/lib/data'
import { getEvents, getOrganizers } from '@/lib/supabase/queries'

gsap.registerPlugin(ScrollTrigger)


export default function LandingPage() {
  const [events, setEvents] = useState<any[]>([])
  const [organizers, setOrganizers] = useState<any[]>([])
  const FEATURED = events.slice(0,3)
  const headRef  = useRef<HTMLDivElement>(null)
  const ctaRef   = useRef<HTMLDivElement>(null)
  const gridRef  = useRef<HTMLDivElement>(null)


  useEffect(() => {
    async function loadData() {
      const eventsData = await getEvents()
      const organizersData = await getOrganizers()
      setEvents(eventsData)
      setOrganizers(organizersData)
    }

    loadData()
  }, [])

  /* Hero entrance */
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.08 })
    tl.from(headRef.current, { opacity: 0, y: 36, duration: 0.75, ease: 'power3.out' })
      .from(ctaRef.current,  { opacity: 0, y: 20, duration: 0.55, ease: 'power3.out' }, '-=0.4')
      .from(gridRef.current, { opacity: 0, x: 28, duration: 0.7,  ease: 'power3.out' }, '-=0.42')
  }, [])

  /* Scroll reveals */
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

  return (
    <div className="overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════
          HERO — asymmetric: editorial left + bento grid right
      ════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden grid-bg">
        <div className="orb w-[480px] h-[480px] -left-36 top-12" style={{ background: 'rgba(123,63,228,0.2)' }} />
        <div className="orb w-72 h-72 right-0 bottom-20"           style={{ background: 'rgba(196,181,253,0.06)' }} />

        <div className="container-page w-full py-20 relative z-10">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-center">

            {/* Left — copy */}
            <div ref={headRef}>
              {/* Live indicator */}
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
                style={{ background: 'rgba(123,63,228,0.12)', border: '1px solid rgba(196,181,253,0.18)' }}>
                <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#7B3FE4' }} />
                <span className="text-[0.68rem] font-body font-semibold tracking-wide" style={{ color: '#C4B5FD' }}>
                  40+ verified organizers · 500+ events
                </span>
              </div>

              {/* Headline — weight 700, not 800/900 */}
              <h1 className="h-hero mb-6 max-w-[560px]" style={{ color: '#F0EAFF' }}>
                The home of<br />
                verified tech events<br />
                in <span className="gradient-text">Africa.</span>
              </h1>

              <p className="font-body text-lg leading-relaxed mb-10 max-w-[440px]" style={{ color: 'rgba(240,234,255,0.42)', fontSize: '1.05rem' }}>
                Stop hearing about great events after they've happened. Verivent surfaces only curated, verified opportunities — early enough to actually attend.
              </p>

              <div ref={ctaRef} className="flex flex-wrap gap-4 mb-12">
                <Link href="/events" className="btn-pri text-white font-semibold px-8 py-4 text-base">
                  Browse Events
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link href="/apply" className="btn-ghost px-8 py-4 text-base">
                  Apply as Organizer
                </Link>
              </div>

              {/* Social proof — organizer avatars */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
  {organizers.slice(0, 4).map((org, i) => (
    <div
      key={org.id}
      className={`w-9 h-9 rounded-full flex items-center justify-center text-[0.55rem] font-display font-bold ring-2 flex-shrink-0 ${org.avatarColor}`}
      style={{
        color: '#C4B5FD',
        zIndex: 4 - i,
        border: '2px solid #0D0719'
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

            {/* Right — bento grid of real event previews (no placeholder text visible) */}
            <div ref={gridRef} className="hidden lg:grid grid-cols-2 grid-rows-[200px_160px] gap-3 relative">

              {/* Card 1 — tech, tall */}
              <div className="row-span-2 gcard rounded-2xl overflow-hidden e-card float-a">
                <div className="ev-img ev-img-tech h-[220px] w-full relative">
                  <span className="absolute bottom-3 left-3 tag tag-tech z-10">💻 Tech</span>
                  <span className="photo-hint">📸 photo</span>
                </div>
                <div className="p-4">
                  <div className="h-sm mb-1" style={{ color: '#F0EAFF', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.88rem' }}>
                    Lagos Dev Summit
                  </div>
                  <div className="text-xs font-body mb-3" style={{ color: 'rgba(240,234,255,0.35)' }}>Jun 28 · Landmark VI</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-primary/25 text-[0.45rem] font-bold flex items-center justify-center font-display" style={{ color: '#C4B5FD' }}>G</div>
                    <span className="text-[0.65rem] font-body" style={{ color: 'rgba(240,234,255,0.35)' }}>GDG Lagos</span>
                    <VerifiedBadge size={11} />
                  </div>
                </div>
              </div>

              {/* Card 2 — design, short */}
              <div className="gcard rounded-2xl overflow-hidden e-card float-b">
                <div className="ev-img ev-img-design h-24 w-full relative">
                  <span className="absolute bottom-2 left-2 tag tag-design z-10" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>🎨 Design</span>
                </div>
                <div className="px-3 py-2.5">
                  <div className="font-display font-semibold text-xs mb-0.5 truncate" style={{ color: '#F0EAFF' }}>Design Unplugged</div>
                  <div className="flex items-center gap-1">
                    <span className="text-[0.6rem] font-body" style={{ color: 'rgba(240,234,255,0.3)' }}>Design Week NG</span>
                    <VerifiedBadge size={10} />
                  </div>
                </div>
              </div>

              {/* Card 3 — startup, short */}
              <div className="gcard rounded-2xl overflow-hidden e-card">
                <div className="ev-img ev-img-startup h-16 w-full relative">
                  <span className="absolute bottom-2 left-2 tag tag-startup z-10" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>🚀 Startup</span>
                </div>
                <div className="px-3 py-2.5">
                  <div className="font-display font-semibold text-xs mb-0.5 truncate" style={{ color: '#F0EAFF' }}>Startup Grind Lagos</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-[0.6rem] font-body" style={{ color: 'rgba(240,234,255,0.3)' }}>Startup Grind</span>
                      <VerifiedBadge size={10} />
                    </div>
                    <span className="text-[0.65rem] font-display font-semibold" style={{ color: '#C4B5FD' }}>₦2,500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ MARQUEE ════════════ */}
      <div className="py-6 overflow-hidden border-y border-white/[0.05]">
        <div className="marquee-inner">
          {['Google Developer Groups','Startup Grind Lagos','Design Week Nigeria','TechPoint Africa','Ingressive for Good','ALX Africa','Creative Morning Lagos','HNG Internship',
            'Google Developer Groups','Startup Grind Lagos','Design Week Nigeria','TechPoint Africa','Ingressive for Good','ALX Africa','Creative Morning Lagos','HNG Internship',
          ].map((name, i) => (
            <span key={i} className="inline-flex items-center gap-10">
              <span className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.2)' }}>{name}</span>
              <span style={{ color: 'rgba(123,63,228,0.3)', fontSize: '0.65rem' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          THE PROBLEM — one large statement + two points
          (breaks the three-identical-cards AI pattern)
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="orb w-96 h-96 right-0 top-0 translate-x-1/3" style={{ background: 'rgba(123,63,228,0.08)' }} />
        <div className="container-page relative z-10">

          <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-start">

            {/* Left — big statement */}
            <div className="sr">
              <div className="sec-label sec-label-left"><span>The Problem</span></div>
              <h2 className="h-xl mb-6" style={{ color: '#F0EAFF' }}>
                You shouldn&apos;t hear<br />about great events<br />
                <span className="gradient-text">after they happen.</span>
              </h2>
              <p className="font-body text-lg leading-relaxed max-w-md" style={{ color: 'rgba(240,234,255,0.38)', fontSize: '1rem' }}>
                The current event ecosystem is broken. Valuable opportunities are buried in noise, discovered too late — or not at all. That&apos;s exactly the problem we exist to solve.
              </p>
            </div>

            {/* Right — stacked pain points (different sizes, not clones) */}
            <div className="space-y-4">
              <div className="sr gcard rounded-2xl p-7">
                <div className="text-2xl mb-4">📡</div>
                <h3 className="h-md mb-2" style={{ color: '#F0EAFF' }}>Fragmented discovery</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(240,234,255,0.36)' }}>
                  Events are scattered across Eventbrite, WhatsApp groups, Twitter threads, and random email lists. No single trusted source.
                </p>
              </div>

              <div className="sr grid grid-cols-2 gap-4">
                <div className="gcard rounded-2xl p-5">
                  <div className="text-2xl mb-3">🔇</div>
                  <h3 className="font-display font-semibold text-sm mb-1.5" style={{ color: '#F0EAFF', letterSpacing: '-0.01em' }}>Too much noise</h3>
                  <p className="font-body text-xs leading-relaxed" style={{ color: 'rgba(240,234,255,0.34)' }}>Quality buried under spam and unverified posts.</p>
                </div>
                <div className="gcard rounded-2xl p-5">
                  <div className="text-2xl mb-3">⏰</div>
                  <h3 className="font-display font-semibold text-sm mb-1.5" style={{ color: '#F0EAFF', letterSpacing: '-0.01em' }}>Always too late</h3>
                  <p className="font-body text-xs leading-relaxed" style={{ color: 'rgba(240,234,255,0.34)' }}>You find out when it&apos;s already sold out.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FEATURED EVENTS — 1 large hero card + 2 smaller
          (not three identical columns)
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="container-page">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="sec-label sec-label-left sr"><span>Featured Events</span></div>
              <h2 className="sr h-xl" style={{ color: '#F0EAFF' }}>Don&apos;t miss these.</h2>
            </div>
            <Link href="/events" className="sr btn-ghost px-5 py-2.5 text-sm hidden md:flex">
              View all
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Asymmetric layout: large left + two stacked right */}
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5 mb-5">
            <div className="sr">
              <EventCard event={FEATURED[0]} variant="featured" />
            </div>
            <div className="grid grid-rows-2 gap-5">
              <div className="sr"><EventCard event={FEATURED[1]} /></div>
              <div className="sr"><EventCard event={FEATURED[2]} /></div>
            </div>
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link href="/events" className="btn-ghost px-7 py-3 text-sm">View all events</Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CATEGORIES — horizontal pill row (not a grid of boxes)
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="orb w-80 h-80 right-0 translate-x-1/3" style={{ background: 'rgba(123,63,228,0.09)' }} />
        <div className="container-page relative z-10">
          <div className="sec-label sec-label-left sr"><span>Categories</span></div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <h2 className="sr h-xl max-w-sm" style={{ color: '#F0EAFF' }}>
              Find your<br /><span className="gradient-text">ecosystem.</span>
            </h2>
            <p className="sr font-body text-base max-w-xs" style={{ color: 'rgba(240,234,255,0.36)', fontSize: '0.95rem' }}>
              Tech, design, startup, career, or community — we cover the events that matter to you.
            </p>
          </div>

          {/* Horizontal scrolling categories */}
          <div className="sr flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {(Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][]).map(([key, meta]) => {
              const counts: Record<Category, number> = { tech:142, design:87, startup:64, career:51, community:93 }
              const hoverColors: Record<Category, string> = {
                tech: 'rgba(123,63,228,0.1)', design: 'rgba(236,72,153,0.1)',
                startup: 'rgba(16,185,129,0.1)', career: 'rgba(245,158,11,0.1)', community: 'rgba(59,130,246,0.1)',
              }
              return (
                <Link key={key} href={`/events?category=${key}`}
                  className="gcard rounded-2xl p-5 flex-shrink-0 group transition-all"
                  style={{ minWidth: '160px' }}>
                  <div className="text-3xl mb-3 transition-transform group-hover:scale-110">{meta.emoji}</div>
                  <div className="font-display font-semibold text-sm mb-1" style={{ color: '#F0EAFF' }}>{meta.label}</div>
                  <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.28)' }}>{counts[key]} events</div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          VERIFIED ORGANIZERS — profile rows, not logo boxes
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="container-page">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-start">

            {/* Left */}
            <div>
              <div className="sec-label sec-label-left sr"><span>Verified Organizers</span></div>
              <h2 className="sr h-xl mb-6" style={{ color: '#F0EAFF' }}>
                Events from people<br />
                <span className="gradient-text">you can trust.</span>
              </h2>
              <p className="sr font-body text-base leading-relaxed mb-8" style={{ color: 'rgba(240,234,255,0.38)', fontSize: '0.98rem' }}>
                Every organizer on Verivent is manually reviewed. The verified badge isn&apos;t handed out — it&apos;s earned. That&apos;s how we keep quality high and noise out.
              </p>
              <div className="sr flex flex-wrap gap-3 mb-8">
                {['Real events, real people','Proven track record','No scams, no fluff'].map(t => (
                  <div key={t} className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ background: 'rgba(123,63,228,0.12)', border: '1px solid rgba(196,181,253,0.18)' }}>
                    <VerifiedBadge size={12} />
                    <span className="text-xs font-body" style={{ color: '#C4B5FD' }}>{t}</span>
                  </div>
                ))}
              </div>
              <div className="sr">
                <Link href="/apply" className="btn-pri text-white font-semibold px-7 py-3.5 text-sm">
                  Apply to be verified
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>

            {/* Right — organizer profile rows */}
            <div className="space-y-3">
              {organizers.map((org, i) => (
                <Link key={org.id} href={`/organizers/${org.id}`}
                  className={`sr gcard rounded-2xl p-5 flex items-center gap-4 group block ${i === 0 ? 'anim-border' : ''}`}>

                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-xl ${org.avatarColor} flex items-center justify-center font-display font-bold text-sm flex-shrink-0`}
                    style={{ color: '#C4B5FD', border: '1px solid rgba(196,181,253,0.12)' }}>
                    {org.initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {/* Name + verified badge (Twitter pattern) */}
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-display font-semibold text-sm group-hover:text-lavender transition-colors" style={{ color: '#F0EAFF' }}>
                        {org.name}
                      </span>
                      <VerifiedBadge size={14} />
                    </div>
                    <p className="text-xs font-body truncate" style={{ color: 'rgba(240,234,255,0.3)' }}>
                      {org.type} · {org.eventsCount} events · {org.attendees} attendees
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="flex-shrink-0 group-hover:translate-x-1 transition-transform"
                    style={{ color: 'rgba(196,181,253,0.25)' }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          HOW IT WORKS — horizontal timeline, not three boxes
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="orb w-96 h-96 left-0 -translate-x-1/3" style={{ background: 'rgba(196,181,253,0.05)' }} />
        <div className="container-page relative z-10">
          <div className="sec-label sec-label-center sr"><span>How It Works</span></div>
          <h2 className="sr h-xl text-center mb-16" style={{ color: '#F0EAFF' }}>
            Simple. <span className="gradient-text">Powerful.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-0 relative">
            {/* Connecting line — desktop */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-px"
              style={{ background: 'linear-gradient(90deg, rgba(123,63,228,0.4), rgba(196,181,253,0.2), rgba(123,63,228,0.4))' }} />

            {[
              { n:'01', title:'We Curate',    body:"Our team hand-selects only the highest-quality events from verified organizers. Every listing earns its place." },
              { n:'02', title:'We Verify',    body:"Every organizer passes manual review. The purple badge means real people, real events — no scams, no fake listings." },
              { n:'03', title:'You Discover', body:"Browse a clean feed, filter by what matters to you, and register early. Get there before it sells out." },
            ].map(({ n, title, body }) => (
              <div key={n} className="sr text-center px-8 md:px-6 py-6">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center glow-sm"
                  style={{ background: 'linear-gradient(145deg, #1A1032, #130D26)', border: '1px solid rgba(123,63,228,0.28)' }}>
                  <span className="font-display font-bold" style={{ color: '#7B3FE4', fontSize: '1.1rem' }}>{n}</span>
                </div>
                <h3 className="h-md mb-3" style={{ color: '#F0EAFF' }}>{title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(240,234,255,0.36)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FINAL CTA — full-width, immersive, not a card
      ════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="orb w-[600px] h-[600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: 'rgba(123,63,228,0.14)' }} />
        <div className="container-page relative z-10 text-center">
          <div className="sr max-w-3xl mx-auto">
            <div className="text-[0.67rem] font-body font-bold uppercase tracking-widest mb-6 block" style={{ color: '#7B3FE4' }}>
              Never Miss What Matters
            </div>
            <h2 className="h-xl mb-6" style={{ color: '#F0EAFF' }}>
              Be first.<br />
              <span className="gradient-text">Stay ahead.</span>
            </h2>
            <p className="font-body text-lg mb-12 max-w-md mx-auto" style={{ color: 'rgba(240,234,255,0.38)', fontSize: '1rem' }}>
              Join the community discovering verified opportunities before everyone else.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/events" className="btn-pri text-white font-semibold px-10 py-4 text-base">Start Discovering</Link>
              <Link href="/apply" className="btn-ghost px-8 py-4 text-base">Apply as Organizer</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
