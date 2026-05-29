'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Event } from '@/lib/data'
import { CATEGORY_META, FORMAT_META } from '@/lib/data'
import { VerifiedBadge } from '@/components/VerifiedBadge'

interface EventCardProps {
  event: Event
  showOrganizer?: boolean
  variant?: 'default' | 'featured'
}

const IMG_CLASS: Record<string, string> = {
  tech: 'ev-img ev-img-tech',
  design: 'ev-img ev-img-design',
  startup: 'ev-img ev-img-startup',
  career: 'ev-img ev-img-career',
  community: 'ev-img ev-img-community',
}

export function EventCard({ event, showOrganizer = true, variant = 'default' }: EventCardProps) {
  const [bookmarked, setBookmarked] = useState(false)
  const isFree = event.price === 'Free' || event.price === 0
  const cat = CATEGORY_META[event.category]
  const fmt = FORMAT_META[event.format]

  const badgeCfg = {
    featured: { label: 'Featured', cls: 'bg-primary/85 text-white', pos: 'right-3 top-3' },
    free: { label: 'Free', cls: 'bg-emerald-500/80 text-white', pos: 'left-3 top-3' },
    'selling-fast': { label: 'Selling Fast', cls: 'bg-amber-500/80 text-white', pos: 'right-3 top-3' },
  } as const

  const imgH = variant === 'featured' ? 'h-56' : 'h-44'

  return (
    <article className="e-card gcard rounded-2xl overflow-hidden flex flex-col h-full">
      <Link href={`/events/${event.id}`} className="block relative flex-shrink-0">
        <div className={`${IMG_CLASS[event.category]} ${imgH} w-full`}>
          <span className={`absolute bottom-3 left-3 tag ${cat.tagClass} z-10`}>
            {cat.emoji} {cat.label}
          </span>

          {event.badge && (
            <span className={`absolute ${badgeCfg[event.badge].pos} text-[0.6rem] font-body font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm z-10 ${badgeCfg[event.badge].cls}`}>
              {badgeCfg[event.badge].label}
            </span>
          )}

          <span className="photo-hint">📸 photo</span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[0.65rem] text-fg-subtle font-body">{fmt.label}</span>
          <span className="w-1 h-1 rounded-full bg-white/15 flex-shrink-0" />
          <span className="text-[0.65rem] text-fg-subtle font-body truncate">{event.date}</span>
        </div>

        <Link href={`/events/${event.id}`} className="flex-1">
          <h3 className="h-sm text-fg mb-2 line-clamp-2 hover:text-lavender transition-colors" style={{ color: '#F0EAFF' }}>
            {event.title}
          </h3>
        </Link>

        <p className="text-[0.72rem] text-fg-subtle font-body mb-4 truncate flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0" style={{ color: 'rgba(196,181,253,0.4)' }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {event.location}
        </p>

        <div className="flex items-center justify-between pt-3.5 border-t border-white/[0.06]">
          {showOrganizer && (
            <Link
              href={`/organizers/${event.organizerId}`}
              className="flex items-center gap-2 min-w-0 group"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[0.5rem] font-display font-bold text-lavender border border-white/10"
                style={{ background: event.orgColor }}
              >
                {event.orgInitials.charAt(0)}
              </div>

              <div className="flex items-center gap-1 min-w-0">
                <span className="text-[0.72rem] text-fg-subtle group-hover:text-lavender transition-colors font-body truncate">
                  {event.organizer}
                </span>
                {event.organizerVerified && <VerifiedBadge size={13} />}
              </div>
            </Link>
          )}

          <div className="flex items-center gap-2.5 flex-shrink-0 ml-auto">
            <button
              onClick={(e) => {
                e.preventDefault()
                setBookmarked((b) => !b)
              }}
              className="transition-colors"
              style={{ color: bookmarked ? '#7B3FE4' : 'rgba(240,234,255,0.22)' }}
              aria-label="Bookmark"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
            <span className={`font-display font-semibold text-sm ${isFree ? 'text-emerald-400' : 'text-lavender'}`} style={{ color: isFree ? '#34d399' : '#C4B5FD' }}>
              {isFree ? 'Free' : `₦${Number(event.price).toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
