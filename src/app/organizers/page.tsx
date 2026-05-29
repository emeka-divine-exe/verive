'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { Footer } from '@/components/Footer'
import { getOrganizers } from '@/lib/supabase/queries'
import { CATEGORY_META, type Organizer } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

function OrgCard({ org }: { org: Organizer }) {
  const [coverFailed, setCoverFailed] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <Link href={`/organizers/${org.id}`} className="sr e-card gcard rounded-3xl overflow-hidden block">
      <div className="w-full relative overflow-hidden" style={{ height: '112px', background: org.coverColor }}>
        {!coverFailed && org.coverUrl ? (
          <Image
            src={org.coverUrl}
            alt={`${org.name} cover`}
            fill
            className="object-cover"
            onError={() => setCoverFailed(true)}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : null}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,7,25,0) 0%, rgba(13,7,25,0.35) 100%)' }} />
      </div>

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-sm flex-shrink-0 -mt-10 ring-4 relative overflow-hidden"
            style={{ background: org.avatarColor, color: '#C4B5FD', boxShadow: '0 0 0 4px #0D0719', border: '1px solid rgba(196,181,253,0.12)' }}>
            {!logoFailed && org.avatarUrl ? (
              <Image
                src={org.avatarUrl}
                alt={org.name}
                fill
                className="object-cover rounded-2xl"
                onError={() => setLogoFailed(true)}
                sizes="56px"
              />
            ) : (
              <span>{org.initials}</span>
            )}
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-display font-bold text-lg" style={{ color: '#F0EAFF', letterSpacing: '-0.015em' }}>
                {org.name}
              </h3>
              {org.verified && <VerifiedBadge size={16} />}
            </div>
            <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(240,234,255,0.36)' }}>{org.bio}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 mb-5">
          {org.categories.map((cat) => {
            const meta = CATEGORY_META[cat]
            return (
              <span key={cat} className={`tag ${meta.tagClass}`}>
                {meta.emoji} {meta.label}
              </span>
            )
          })}
        </div>

        <div className="flex items-center gap-5 pt-4" style={{ borderTop: '1px solid rgba(196,181,253,0.07)' }}>
          {[
            { v: org.eventsCount.toString(), l: 'Events' },
            { v: org.attendees, l: 'Attendees' },
            { v: `${org.rating || 0}★`, l: 'Rating' },
          ].map(({ v, l }, i) => (
            <div key={l} className="flex items-center gap-5">
              {i > 0 && <div className="w-px h-7" style={{ background: 'rgba(255,255,255,0.07)' }} />}
              <div className="text-center">
                <div className="font-display font-bold" style={{ color: '#F0EAFF', fontSize: '1.15rem' }}>{v}</div>
                <div className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.26)' }}>{l}</div>
              </div>
            </div>
          ))}
          <div className="ml-auto text-xs font-body" style={{ color: 'rgba(240,234,255,0.2)' }}>Since {org.since}</div>
        </div>
      </div>
    </Link>
  )
}

export default function OrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([])

  useEffect(() => {
    let mounted = true
    getOrganizers().then((data) => {
      if (!mounted) return
      setOrganizers(data)
    })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>('.sr')
    els.forEach((el) =>
      gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      }),
    )
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <div className="min-h-screen">
      <div className="page-header">
        <div className="orb w-96 h-96 right-0 top-0 translate-x-1/3 -translate-y-1/4" style={{ background: 'rgba(123,63,228,0.15)' }} />
        <div className="container-page relative z-10">
          <div className="sec-label sec-label-left sr"><span>Verified Organizers</span></div>
          <h1 className="sr h-xl mb-4" style={{ color: '#F0EAFF' }}>
            Events from people<br /><span className="gradient-text">you can trust.</span>
          </h1>
          <p className="sr font-body max-w-lg mb-8" style={{ color: 'rgba(240,234,255,0.38)', fontSize: '1rem' }}>
            Every organizer below is loaded from Supabase and can be verified, featured, or managed from the organizer workflow.
          </p>
          <Link href="/organizers/apply" className="sr btn-pri text-white font-semibold px-7 py-3.5 text-sm inline-flex">
            Apply as Organizer
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>

      <div className="container-page py-16 pb-24">
        {organizers.length === 0 ? (
          <div className="gcard rounded-2xl p-12 text-center">
            <p className="font-body text-sm" style={{ color: 'rgba(240,234,255,0.35)' }}>
              No organizers have been added yet. Add organizer profiles in Supabase to populate this page.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {organizers.map((org) => <OrgCard key={org.id} org={org} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
