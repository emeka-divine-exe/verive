import Link from 'next/link'
import type { ReactNode } from 'react'

export interface EventCardProps {
  id?: string
  title: string
  organizer: string
  date: string
  location: string
  category: 'tech' | 'design' | 'startup' | 'career' | 'community'
  price: string | number
  badge?: 'featured' | 'free' | 'selling-fast'
  gradientFrom?: string
  imagePlaceholder: string
  href?: string
}

const categoryStyles: Record<string, string> = {
  tech:      'tag-tech',
  design:    'tag-design',
  startup:   'tag-startup',
  career:    'tag-career',
  community: 'tag-comm',
}

const categoryLabels: Record<string, string> = {
  tech: 'Tech', design: 'Design', startup: 'Startup', career: 'Career', community: 'Community',
}

const gradients: Record<string, string> = {
  tech:      'from-primary/35',
  design:    'from-pink-900/38',
  startup:   'from-emerald-900/32',
  career:    'from-amber-900/28',
  community: 'from-blue-900/28',
}

function Badge({ type }: { type: EventCardProps['badge'] }) {
  if (!type) return null
  const map = {
    featured:     { label: 'Featured',     cls: 'bg-primary/80' },
    free:         { label: 'Free',         cls: 'bg-emerald-500/75' },
    'selling-fast':{ label: 'Selling Fast', cls: 'bg-amber-500/75' },
  }
  const b = map[type]
  return (
    <div className={`absolute top-3 ${type === 'free' ? 'left-3' : 'right-3'}`}>
      <span className={`${b.cls} backdrop-blur-sm text-white text-[0.62rem] font-body font-semibold px-2.5 py-1 rounded-full`}>
        {b.label}
      </span>
    </div>
  )
}

export function EventCard({
  title, organizer, date, location, category, price, badge, imagePlaceholder, href = '/events/1'
}: EventCardProps) {
  const isFree = price === 'Free' || price === 0

  return (
    <Link href={href} className="e-card gcard rounded-2xl overflow-hidden block">
      {/* Image area */}
      <div className={`w-full h-44 bg-gradient-to-br ${gradients[category]} to-void img-slot relative`}>
        <span className="relative z-0">{imagePlaceholder}</span>
        <Badge type={badge} />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex gap-2 mb-2.5">
          <span className={`tag ${categoryStyles[category]}`}>{categoryLabels[category]}</span>
          <span className="v-badge rounded-full px-2 py-0.5 text-[0.62rem] text-lavender font-body">✓</span>
        </div>
        <h3 className="font-display font-bold text-[#F0EAFF] text-base leading-tight mb-1">{title}</h3>
        <p className="text-xs text-[#F0EAFF]/28 font-body mb-4">
          {date} · {location}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <span className="text-xs text-[#F0EAFF]/35 font-body">{organizer} ✓</span>
          <span className={`font-display font-bold text-sm ${isFree ? 'text-emerald-400' : 'text-lavender'}`}>
            {isFree ? 'Free' : typeof price === 'number' ? `₦${price.toLocaleString()}` : price}
          </span>
        </div>
      </div>
    </Link>
  )
}
