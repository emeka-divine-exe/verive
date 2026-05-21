'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EventCard } from '@/components/EventCard'
import { Footer } from '@/components/Footer'

gsap.registerPlugin(ScrollTrigger)

// ── Data ──────────────────────────────────────────────────────────────────────

const FEATURED_EVENTS = [
  {
    id: '1',
    title: 'Lagos Developer Summit 2025',
    organizer: 'GDG Lagos',
    date: 'Jun 28–29, 2025',
    location: 'Landmark Centre, VI',
    category: 'tech' as const,
    price: 5000,
    badge: 'featured' as const,
    imagePlaceholder: '[ Image: Lagos Dev Summit — tech conference, developer crowd, speaker on stage. Pinterest: "developer conference photography Nigeria dark" ]',
  },
  {
    id: '2',
    title: 'Design Unplugged: Vol. 3',
    organizer: 'Design Week NG',
    date: 'Jul 5, 2025',
    location: 'Online · Zoom',
    category: 'design' as const,
    price: 'Free',
    badge: 'free' as const,
    imagePlaceholder: '[ Image: Design Unplugged — creative workspace, warm-lit workshop, design tools. Pinterest: "design conference workshop photography dark warm" ]',
  },
  {
    id: '3',
    title: 'Startup Grind Lagos — July',
    organizer: 'Startup Grind',
    date: 'Jul 12, 2025',
    location: 'Co-Creation Hub, Yaba',
    category: 'startup' as const,
    price: 2500,
    badge: 'selling-fast' as const,
    imagePlaceholder: '[ Image: Startup Grind Lagos — pitch stage, founders, energetic crowd. Pinterest: "startup pitch event Nigeria Africa photography" ]',
  },
]

const CATEGORIES = [
  { emoji: '💻', label: 'Tech',      count: 142, color: 'hover:bg-primary/8',     href: '/events?cat=tech' },
  { emoji: '🎨', label: 'Design',    count: 87,  color: 'hover:bg-pink-500/8',    href: '/events?cat=design' },
  { emoji: '🚀', label: 'Startup',   count: 64,  color: 'hover:bg-emerald-500/8', href: '/events?cat=startup' },
  { emoji: '💼', label: 'Career',    count: 51,  color: 'hover:bg-amber-500/8',   href: '/events?cat=career' },
  { emoji: '🌍', label: 'Community', count: 93,  color: 'hover:bg-blue-500/8',    href: '/events?cat=community' },
]

const ORGANIZERS = [
  { code: 'GDG', name: 'GDG Lagos',          type: 'Tech',      events: 24, color: 'bg-primary/22 text-primary' },
  { code: 'DW',  name: 'Design Week NG',      type: 'Design',    events: 12, color: 'bg-pink-500/18 text-pink-400' },
  { code: 'SG',  name: 'Startup Grind',       type: 'Startup',   events: 36, color: 'bg-emerald-500/18 text-emerald-400' },
  { code: 'i4G', name: 'Ingressive for Good', type: 'Community', events: 18, color: 'bg-blue-500/18 text-blue-400' },
]

// ── GSAP hook ─────────────────────────────────────────────────────────────────

function useReveal(selector: string, deps: unknown[] = []) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(selector)
    els.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        }
      )
    })
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const heroRef   = useRef<HTMLDivElement>(null)
  const pillRef   = useRef<HTMLDivElement>(null)
  const headRef   = useRef<HTMLHeadingElement>(null)
  const subRef    = useRef<HTMLParagraphElement>(null)
  const ctaRef    = useRef<HTMLDivElement>(null)
  const statsRef  = useRef<HTMLDivElement>(null)

  // Hero entrance animation
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.15 })
    tl.from(pillRef.current,  { opacity: 0, y: 18, duration: 0.55, ease: 'power3.out' })
      .from(headRef.current,  { opacity: 0, y: 44, duration: 0.8,  ease: 'power3.out' }, '-=0.3')
      .from(subRef.current,   { opacity: 0, y: 28, duration: 0.65, ease: 'power3.out' }, '-=0.4')
      .from(ctaRef.current,   { opacity: 0, y: 20, duration: 0.55, ease: 'power3.out' }, '-=0.35')
      .from(statsRef.current, { opacity: 0, y: 16, duration: 0.5,  ease: 'power3.out' }, '-=0.28')
  }, [])

  useReveal('.scroll-reveal')

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-16 grid-bg">
        {/* Orbs */}
        <div className="orb w-[500px] h-[500px] bg-primary/25 -left-32 top-16" />
        <div className="orb w-80 h-80 bg-lavender/8 right-0 bottom-20" />
        <div className="orb w-72 h-72 bg-primary/12 right-1/3 top-1/3" />

        <div className="max-w-7xl mx-auto px-6 w-full py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Copy */}
            <div>
              {/* Pill */}
              <div ref={pillRef} className="inline-flex items-center gap-2 v-badge rounded-full px-4 py-2 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[0.7rem] font-body font-semibold text-lavender tracking-wide">
                  Curated · Verified · Trusted
                </span>
              </div>

              {/* Headline */}
              <h1
                ref={headRef}
                className="font-display font-extrabold text-5xl lg:text-[4.2rem] leading-[1.04] text-[#F0EAFF] mb-6"
              >
                Discover events<br />
                that actually<br />
                <span className="gradient-text">matter.</span>
              </h1>

              {/* Sub */}
              <p ref={subRef} className="font-body text-[1.05rem] text-[#F0EAFF]/45 leading-relaxed mb-10 max-w-[420px]">
                Verivent curates only verified, high-value tech, design, and startup events — so you find the right
                opportunity before everyone else does.
              </p>

              {/* CTAs */}
              <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
                <Link
                  href="/events"
                  className="btn-pri text-white font-body font-semibold px-8 py-4 rounded-full text-[0.95rem] flex items-center gap-2"
                >
                  Browse Events
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/apply"
                  className="btn-ghost text-[#F0EAFF]/65 hover:text-[#F0EAFF] font-body font-medium px-8 py-4 rounded-full text-[0.95rem]"
                >
                  Apply as Organizer
                </Link>
              </div>

              {/* Stats */}
              <div ref={statsRef} className="flex items-center gap-8 mt-12 pt-8 border-t border-white/[0.06]">
                {[
                  { value: '500+', label: 'Curated Events' },
                  { value: '40+',  label: 'Verified Organizers' },
                  { value: '12k+', label: 'Opportunities Found' },
                ].map(({ value, label }, i) => (
                  <div key={label} className="flex items-center gap-8">
                    {i > 0 && <div className="w-px h-8 bg-white/10" />}
                    <div>
                      <div className="font-display font-bold text-2xl text-[#F0EAFF]">{value}</div>
                      <div className="text-xs text-[#F0EAFF]/35 font-body mt-0.5">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual cluster — desktop only */}
            <div className="relative hidden lg:flex items-center justify-center h-[520px]">

              {/* Main floating event card */}
              {/*
                IMAGE NEEDED — Hero event card banner
                Section: Hero, right panel, top card
                What: Tech conference crowd, Lagos, energetic atmosphere
                Format: 16:9 landscape, min 600×340px, dark-toned
                Pinterest: "tech conference photography Lagos Africa dark"
              */}
              <div className="float-a absolute right-0 top-6 w-[280px] gcard rounded-2xl p-5 anim-border glow-sm">
                <div className="w-full h-36 rounded-xl bg-gradient-to-br from-primary/35 to-void img-slot mb-4 text-[0.6rem]">
                  [ Event banner: Lagos Dev Summit — tech conference, dark + energetic ]
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="tag tag-tech">Tech</span>
                  <span className="v-badge rounded-full px-2 py-0.5 text-[0.65rem] text-lavender font-body font-medium">✓ Verified</span>
                </div>
                <h3 className="font-display font-bold text-[#F0EAFF] text-[0.92rem] leading-snug mb-1.5">
                  Lagos Dev Summit 2025
                </h3>
                <p className="text-xs text-[#F0EAFF]/35 font-body mb-4">June 28 · Landmark Centre, VI</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {['bg-primary/60', 'bg-lavender/50', 'bg-mist/40'].map((c, i) => (
                      <div key={i} className={`w-5 h-5 rounded-full ${c} border border-void`} />
                    ))}
                    <div className="w-5 h-5 rounded-full bg-primary/30 border border-void flex items-center justify-center text-[0.5rem] text-lavender font-bold">+8</div>
                  </div>
                  <span className="text-xs text-[#F0EAFF]/35 font-body">1.2k going</span>
                </div>
              </div>

              {/* Secondary card */}
              <div className="float-b absolute left-0 bottom-8 w-[240px] gcard rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-lg flex-shrink-0">🎨</div>
                  <div>
                    <div className="font-display font-semibold text-[#F0EAFF] text-sm leading-tight">Design Unplugged</div>
                    <div className="text-xs text-[#F0EAFF]/35 font-body">Jul 5 · Online</div>
                  </div>
                </div>
                <div className="prog-bar mb-2"><div className="prog-fill" style={{ width: '73%' }} /></div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#F0EAFF]/35 font-body">73% filled</span>
                  <span className="text-xs text-emerald-400 font-body font-semibold">Free</span>
                </div>
              </div>

              {/* Notification pill */}
              <div className="absolute top-1/2 left-12 -translate-y-1/2 gcard rounded-xl px-4 py-3 flex items-center gap-3 border border-primary/25 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-emerald-500/18 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400 text-sm">✓</span>
                </div>
                <div>
                  <div className="text-xs font-body font-semibold text-[#F0EAFF]">New Event Added</div>
                  <div className="text-[0.65rem] text-[#F0EAFF]/35 font-body">Startup Grind Lagos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ────────────────────────────────────────────── */}
      <div className="py-7 border-y border-white/[0.05] overflow-hidden">
        <div className="marquee-inner flex items-center gap-14 whitespace-nowrap w-max">
          {[
            'Google Developer Groups', 'Startup Grind Lagos', 'Design Week Nigeria',
            'TechPoint Africa', 'Ingressive for Good', 'ALX Africa',
            'Creative Morning Lagos', 'HNG Internship',
            // duplicate for seamless loop
            'Google Developer Groups', 'Startup Grind Lagos', 'Design Week Nigeria',
            'TechPoint Africa', 'Ingressive for Good', 'ALX Africa',
            'Creative Morning Lagos', 'HNG Internship',
          ].map((name, i) => (
            <span key={i} className="flex items-center gap-14">
              <span className="text-xs text-[#F0EAFF]/22 font-body">{name}</span>
              <span className="text-primary/30 text-xs">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── THE PROBLEM ────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="orb w-96 h-96 bg-primary/10 right-0 top-0 translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="sec-label sec-label-left scroll-reveal"><span>The Problem</span></div>
          <h2 className="scroll-reveal font-display font-extrabold text-4xl lg:text-[3.4rem] text-[#F0EAFF] leading-[1.1] mb-6 max-w-2xl">
            You shouldn&apos;t hear about great events{' '}
            <span className="gradient-text">after they happen.</span>
          </h2>
          <p className="scroll-reveal font-body text-[#F0EAFF]/42 text-lg mb-16 max-w-xl">
            The current event ecosystem is broken. Valuable opportunities are buried in noise, shared too late, discovered by luck — not by design.
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: '📡', color: 'red',   title: 'Fragmented Discovery', body: 'Events are scattered across Eventbrite, WhatsApp groups, Twitter threads, and random email lists. No single trusted source exists.' },
              { icon: '🔇', color: 'amber', title: 'Too Much Noise',       body: 'Quality events get buried under low-effort posts, spam, and unverified information nobody can vouch for.' },
              { icon: '⏰', color: 'orange',title: 'Always Too Late',      body: 'You find out about the best events when they\'re already sold out or happening tomorrow. Early access is reserved for insiders only.' },
            ].map(({ icon, color, title, body }) => (
              <div key={title} className="scroll-reveal gcard rounded-2xl p-8 group">
                <div className={`w-11 h-11 rounded-xl bg-${color}-500/10 group-hover:bg-${color}-500/18 transition-colors flex items-center justify-center mb-6 text-2xl`}>
                  {icon}
                </div>
                <h3 className="font-display font-bold text-[#F0EAFF] text-xl mb-3">{title}</h3>
                <p className="font-body text-[#F0EAFF]/38 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section className="py-28 relative">
        <div className="orb w-96 h-96 bg-lavender/6 left-0 top-0 -translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="sec-label sec-label-center scroll-reveal"><span>How It Works</span></div>
          <h2 className="scroll-reveal font-display font-extrabold text-4xl lg:text-5xl text-[#F0EAFF] text-center mb-4">
            Simple. Trusted. <span className="gradient-text">Powerful.</span>
          </h2>
          <p className="scroll-reveal font-body text-[#F0EAFF]/40 text-center text-lg mb-20 max-w-md mx-auto">
            Three steps between you and your next meaningful opportunity.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'We Curate',   body: 'Our team hand-selects only the highest-quality events from verified organizers across tech, design, and startup ecosystems.' },
              { step: '02', title: 'We Verify',   body: 'Every organizer passes our verification process. The verified badge means real events, real organizers — no scams, no fluff.' },
              { step: '03', title: 'You Discover',body: 'Browse a clean, categorized feed of verified events. Find what matters. Register early. Show up prepared. Build your network.' },
            ].map(({ step, title, body }) => (
              <div key={step} className="scroll-reveal text-center">
                <div className="w-16 h-16 rounded-2xl gcard border border-primary/24 flex items-center justify-center mx-auto mb-6 glow-sm">
                  <span className="font-display font-bold text-primary text-xl">{step}</span>
                </div>
                <h3 className="font-display font-bold text-[#F0EAFF] text-xl mb-3">{title}</h3>
                <p className="font-body text-[#F0EAFF]/40 text-sm leading-relaxed max-w-xs mx-auto">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED EVENTS ────────────────────────────────────── */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <div className="sec-label sec-label-left scroll-reveal"><span>Featured Events</span></div>
              <h2 className="scroll-reveal font-display font-extrabold text-4xl lg:text-5xl text-[#F0EAFF]">
                Don&apos;t miss these.
              </h2>
            </div>
            <Link
              href="/events"
              className="hidden md:flex scroll-reveal btn-ghost text-[#F0EAFF]/50 hover:text-[#F0EAFF] font-body text-sm px-6 py-3 rounded-full items-center gap-2"
            >
              View all
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED_EVENTS.map((ev) => (
              <div key={ev.id} className="scroll-reveal">
                <EventCard {...ev} href={`/events/${ev.id}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="orb w-96 h-96 bg-primary/10 right-0 center translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="sec-label sec-label-center scroll-reveal"><span>Categories</span></div>
          <h2 className="scroll-reveal font-display font-extrabold text-4xl lg:text-5xl text-[#F0EAFF] text-center mb-16">
            Find your <span className="gradient-text">ecosystem.</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map(({ emoji, label, count, color, href }) => (
              <Link
                key={label}
                href={href}
                className={`scroll-reveal gcard rounded-2xl p-6 text-center group cursor-pointer transition-all ${color}`}
              >
                <div className="text-4xl mb-4 transition-transform group-hover:scale-110">{emoji}</div>
                <div className="font-display font-bold text-[#F0EAFF] text-sm mb-1">{label}</div>
                <div className="text-xs text-[#F0EAFF]/28 font-body">{count} events</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── VERIFIED ORGANIZERS ────────────────────────────────── */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Copy */}
            <div>
              <div className="sec-label sec-label-left scroll-reveal"><span>Verified Organizers</span></div>
              <h2 className="scroll-reveal font-display font-extrabold text-4xl lg:text-5xl text-[#F0EAFF] mb-6 leading-[1.1]">
                Events from organizers<br />
                <span className="gradient-text">you can trust.</span>
              </h2>
              <p className="scroll-reveal font-body text-[#F0EAFF]/40 text-lg mb-8 leading-relaxed">
                Every organizer on Verivent is manually vetted. The verified badge isn&apos;t handed out — it&apos;s earned. That&apos;s how we keep the quality high and the noise out.
              </p>
              <div className="scroll-reveal flex flex-wrap gap-3">
                {['Real organizers', 'Proven track record', 'Quality guaranteed'].map((t) => (
                  <div key={t} className="flex items-center gap-2 v-badge rounded-full px-4 py-2">
                    <span className="text-primary text-xs">✓</span>
                    <span className="text-xs font-body text-lavender">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizer grid */}
            <div className="grid grid-cols-2 gap-4">
              {ORGANIZERS.map(({ code, name, type, events, color }, i) => (
                <Link
                  key={code}
                  href="/organizers"
                  className={`scroll-reveal gcard rounded-2xl p-6 cursor-pointer ${i === 0 ? 'anim-border' : ''}`}
                >
                  {/*
                    IMAGE NEEDED — Organizer logo
                    Section: Verified Organizers grid
                    What: Official logo for {name}, square PNG with transparent background
                    Display size: 48×48px (provide 2× for retina)
                    Source: Download from official {name} website or social media
                  */}
                  <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 font-display font-bold text-xs`}>
                    {code}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-semibold text-[#F0EAFF] text-sm">{name}</span>
                    <span className="text-primary text-xs">✓</span>
                  </div>
                  <p className="text-xs text-[#F0EAFF]/28 font-body">{type} · {events} events</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="orb w-[700px] h-[700px] bg-primary/12 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="scroll-reveal gcard rounded-3xl p-12 md:p-16 anim-border text-center relative overflow-hidden">
            <div className="orb w-52 h-52 bg-primary/22 -left-16 -top-16" />
            <div className="orb w-52 h-52 bg-lavender/8 -right-16 -bottom-16" />
            <div className="relative z-10">
              <span className="text-[0.68rem] font-body font-bold text-primary uppercase tracking-widest block mb-5">
                Never Miss What Matters
              </span>
              <h2 className="font-display font-extrabold text-4xl lg:text-6xl text-[#F0EAFF] mb-6 leading-[1.05]">
                Be first.<br />
                <span className="gradient-text">Stay ahead.</span>
              </h2>
              <p className="font-body text-[#F0EAFF]/40 text-lg mb-10 max-w-sm mx-auto">
                Join thousands of professionals discovering opportunities before they&apos;re gone.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/events" className="btn-pri text-white font-body font-semibold px-10 py-4 rounded-full text-base">
                  Start Discovering
                </Link>
                <Link href="/apply" className="btn-ghost text-[#F0EAFF]/55 hover:text-[#F0EAFF] font-body font-medium px-8 py-4 rounded-full text-base">
                  Apply as Organizer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
