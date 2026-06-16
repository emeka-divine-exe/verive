'use client'
import { useState } from 'react'
import Link from 'next/link'
import { type Event, CATEGORY_META, FORMAT_META } from '@/lib/data'
import { VerifiedBadge } from './VerifiedBadge'

interface Props {
  event: Event
  variant?: 'default' | 'featured'
  showOrganizer?: boolean
}

export function EventCard({ event, variant = 'default', showOrganizer = true }: Props) {
  const [bookmarked, setBookmarked] = useState(false)
  const cat = CATEGORY_META[event.category]
  const fmt = FORMAT_META[event.format]
  const isFree = event.price === 'Free' || event.price === 0

  return (
    <Link href={`/events/${event.id}`} className="block h-full">
      <div className={`e-card gcard rounded-2xl overflow-hidden h-full flex flex-col ${variant === 'featured' ? 'gcard-featured' : ''}`}>

        {/* Image area */}
        <div className={`ev-img ev-img-${event.category} relative`}
          style={{ height: variant === 'featured' ? '200px' : '160px' }}>
          {event.imageUrl && (
            <img src={event.imageUrl} alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          )}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(6,9,26,0.75) 0%, transparent 55%)' }} />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`tag tag-${event.category}`}>{cat.emoji} {cat.label}</span>
            {event.badge === 'featured' && (
              <span className="tag tag-featured">Featured</span>
            )}
          </div>

          {/* Bookmark */}
          <button
            onClick={e => { e.preventDefault(); setBookmarked(v => !v) }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(6,9,26,0.6)' }}
            aria-label="Bookmark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth="2"
              style={{ color: bookmarked ? 'var(--v-gold)' : 'var(--v-ghost)' }}>
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="font-display font-semibold text-sm mb-1 line-clamp-2"
            style={{ color: 'var(--v-text)', letterSpacing: '-0.01em' }}>
            {event.title}
          </h3>

          <div className="flex items-center gap-2 mb-3 text-xs font-body"
            style={{ color: 'var(--v-ghost)' }}>
            <span>{event.date}</span>
            <span>·</span>
            <span>{event.location}</span>
          </div>

          <div className="flex items-center gap-2 mb-auto">
            <span className="text-xs font-body px-2 py-0.5 rounded-full"
              style={{ background: 'var(--v-border)', color: 'var(--v-ghost)' }}>
              {fmt.label}
            </span>
            <span className="text-xs font-body px-2 py-0.5 rounded-full"
              style={{ background: 'var(--v-border)', color: isFree ? 'var(--v-teal-l)' : 'var(--v-muted)' }}>
              {isFree ? 'Free' : `₦${Number(event.price).toLocaleString()}`}
            </span>
          </div>

          {/* Organizer row */}
          {showOrganizer && (
            <div className="flex items-center gap-2 mt-3 pt-3"
              style={{ borderTop: '1px solid var(--v-border)' }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[0.5rem] font-bold flex-shrink-0"
                style={{ background: 'var(--v-gold-dim)', color: 'var(--v-gold)' }}>
                {(event.organizer || 'O').charAt(0)}
              </div>
              <span className="text-xs font-body truncate" style={{ color: 'var(--v-muted)' }}>
                {event.organizer}
              </span>
              {event.organizerVerified && <VerifiedBadge size={11} />}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
              }
