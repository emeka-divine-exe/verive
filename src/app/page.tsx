'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { EventCard } from '@/components/EventCard'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { Footer } from '@/components/Footer'

import { EVENTS, ORGANIZERS, CATEGORY_META } from '@/lib/data'
import type { Category } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

const FEATURED = [EVENTS[0], EVENTS[1], EVENTS[2]]

export default function LandingPage() {
  const headRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.08 })

    tl.from(headRef.current, {
      opacity: 0,
      y: 36,
      duration: 0.75,
      ease: 'power3.out',
    })
      .from(
        ctaRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.55,
          ease: 'power3.out',
        },
        '-=0.4'
      )
      .from(
        gridRef.current,
        {
          opacity: 0,
          x: 28,
          duration: 0.7,
          ease: 'power3.out',
        },
        '-=0.42'
      )
  }, [])

  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>('.sr')

    els.forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 28,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 91%',
          once: true,
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden grid-bg">
        <div
          className="orb w-[480px] h-[480px] -left-36 top-12"
          style={{ background: 'rgba(123,63,228,0.2)' }}
        />

        <div
          className="orb w-72 h-72 right-0 bottom-20"
          style={{ background: 'rgba(196,181,253,0.06)' }}
        />

        <div className="container-page w-full py-20 relative z-10">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-center">
            {/* LEFT */}
            <div ref={headRef}>
              <div
                className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(123,63,228,0.12)',
                  border: '1px solid rgba(196,181,253,0.18)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full pulse-dot"
                  style={{ background: '#7B3FE4' }}
                />

                <span
                  className="text-[0.68rem] font-body font-semibold tracking-wide"
                  style={{ color: '#C4B5FD' }}
                >
                  40+ verified organizers · 500+ events
                </span>
              </div>

              <h1
                className="h-hero mb-6 max-w-[560px]"
                style={{ color: '#F0EAFF' }}
              >
                The home of
                <br />
                verified tech events
                <br />
                in <span className="gradient-text">Africa.</span>
              </h1>

              <p
                className="font-body text-lg leading-relaxed mb-10 max-w-[440px]"
                style={{
                  color: 'rgba(240,234,255,0.42)',
                  fontSize: '1.05rem',
                }}
              >
                Stop hearing about great events after they've happened.
                Verivent surfaces only curated, verified opportunities —
                early enough to actually attend.
              </p>

              <div ref={ctaRef} className="flex flex-wrap gap-4 mb-12">
                <Link
                  href="/events"
                  className="btn-pri text-white font-semibold px-8 py-4 text-base"
                >
                  Browse Events
                </Link>

                <Link
                  href="/apply"
                  className="btn-ghost px-8 py-4 text-base"
                >
                  Apply as Organizer
                </Link>
              </div>

              {/* SOCIAL PROOF */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {ORGANIZERS.slice(0, 4).map((org, i) => (
                    <div
                      key={org.id}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[0.55rem] font-display font-bold flex-shrink-0 ${org.avatarColor}`}
                      style={{
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
                  <div
                    className="text-sm font-body font-semibold"
                    style={{ color: '#F0EAFF' }}
                  >
                    Trusted by real organizers
                  </div>

                  <div
                    className="text-xs font-body"
                    style={{ color: 'rgba(240,234,255,0.32)' }}
                  >
                    GDG · Design Week NG · Startup Grind · i4G
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div
              ref={gridRef}
              className="hidden lg:grid grid-cols-2 grid-rows-[200px_160px] gap-3 relative"
            >
              <div className="row-span-2 gcard rounded-2xl overflow-hidden e-card float-a">
                <div className="ev-img ev-img-tech h-[220px] w-full relative">
                  <span className="absolute bottom-3 left-3 tag tag-tech z-10">
                    💻 Tech
                  </span>
                </div>

                <div className="p-4">
                  <div
                    className="h-sm mb-1"
                    style={{
                      color: '#F0EAFF',
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                    }}
                  >
                    Lagos Dev Summit
                  </div>

                  <div
                    className="text-xs font-body mb-3"
                    style={{ color: 'rgba(240,234,255,0.35)' }}
                  >
                    Jun 28 · Landmark VI
                  </div>
                </div>
              </div>

              <div className="gcard rounded-2xl overflow-hidden e-card float-b">
                <div className="ev-img ev-img-design h-24 w-full relative">
                  <span
                    className="absolute bottom-2 left-2 tag tag-design z-10"
                    style={{
                      fontSize: '0.6rem',
                      padding: '2px 8px',
                    }}
                  >
                    🎨 Design
                  </span>
                </div>
              </div>

              <div className="gcard rounded-2xl overflow-hidden e-card">
                <div className="ev-img ev-img-startup h-16 w-full relative">
                  <span
                    className="absolute bottom-2 left-2 tag tag-startup z-10"
                    style={{
                      fontSize: '0.6rem',
                      padding: '2px 8px',
                    }}
                  >
                    🚀 Startup
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
            }
