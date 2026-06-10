'use client'
import { useEffect, useState } from 'react'
import { getOrganizerMetrics } from '@/lib/supabase/reviews'

const TIER_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'New',         color: 'rgba(240,232,214,0.44)', bg: 'rgba(240,232,214,0.07)' },
  2: { label: 'Rising',      color: '#27967F',                bg: 'rgba(31,122,104,0.12)'  },
  3: { label: 'Established', color: '#27967F',                bg: 'rgba(31,122,104,0.12)'  },
  4: { label: 'Top',         color: '#C2820D',                bg: 'rgba(194,130,13,0.12)'  },
  5: { label: 'Verified',    color: '#C2820D',                bg: 'rgba(194,130,13,0.12)'  },
}

const NEXT_MILESTONE: Record<number, string> = {
  1: '5 events to reach Rising',
  2: '10 events to reach Established',
  3: '20 events + 4.0 rating to reach Top',
  4: '4.5 rating to reach Verified',
  5: 'Maximum tier reached',
}

interface Props { organizerId: string }

export function OrganizerMetrics({ organizerId }: Props) {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrganizerMetrics(organizerId).then(data => {
      setMetrics(data)
      setLoading(false)
    })
  }, [organizerId])

  if (loading) return (
    <div className="gcard rounded-2xl p-6 flex justify-center">
      <div className="spinner w-6 h-6 rounded-full border-2"
        style={{ borderColor: 'rgba(194,130,13,0.2)', borderTopColor: '#C2820D' }} />
    </div>
  )

  if (!metrics) return null

  const tier      = metrics.visibility_tier || 1
  const tierInfo  = TIER_LABELS[tier]
  const trustPct  = Math.round((metrics.trust_score || 0) * 100)

  return (
    <div className="gcard rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm" style={{ color: '#F0E8D6', letterSpacing: '-0.01em' }}>
          Reputation Score
        </h3>
        <span className="text-xs font-body font-semibold px-3 py-1 rounded-lg"
          style={{ background: tierInfo.bg, color: tierInfo.color }}>
          {tierInfo.label}
        </span>
      </div>

      {/* Trust score bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-xs" style={{ color: 'rgba(240,232,214,0.44)' }}>Trust Score</span>
          <span className="font-display font-bold text-sm" style={{ color: '#C2820D' }}>{trustPct}%</span>
        </div>
        <div className="prog-bar">
          <div className="prog-fill" style={{ width: `${trustPct}%`, transition: 'width 0.8s ease' }} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Events',   val: metrics.event_count    || 0 },
          { label: 'Reviews',  val: metrics.total_reviews  || 0 },
          { label: 'Avg Rating', val: metrics.average_rating ? `${Number(metrics.average_rating).toFixed(1)}★` : '—' },
        ].map(({ label, val }) => (
          <div key={label} className="text-center p-3 rounded-xl"
            style={{ background: 'rgba(240,232,214,0.04)', border: '1px solid rgba(240,232,214,0.06)' }}>
            <p className="font-display font-bold text-lg" style={{ color: '#F0E8D6' }}>{val}</p>
            <p className="font-body text-[0.6rem]" style={{ color: 'rgba(240,232,214,0.34)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Metric breakdown */}
      {metrics.average_rating > 0 && (
        <div className="space-y-2">
          <p className="font-body text-xs mb-3" style={{ color: 'rgba(240,232,214,0.38)' }}>
            Rating breakdown
          </p>
          {/* Note: organizer_metrics stores aggregate — shown as overall only */}
          <div className="flex items-center gap-3">
            <span className="font-body text-xs w-24 flex-shrink-0"
              style={{ color: 'rgba(240,232,214,0.44)' }}>Overall</span>
            <div className="flex-1 prog-bar">
              <div className="prog-fill"
                style={{ width: `${(metrics.average_rating / 5) * 100}%` }} />
            </div>
            <span className="font-body text-xs w-8 text-right flex-shrink-0"
              style={{ color: '#C2820D' }}>
              {Number(metrics.average_rating).toFixed(1)}
            </span>
          </div>
        </div>
      )}

      {/* Next milestone */}
      <div className="pt-2" style={{ borderTop: '1px solid rgba(240,232,214,0.06)' }}>
        <p className="font-body text-xs" style={{ color: 'rgba(240,232,214,0.32)' }}>
          {NEXT_MILESTONE[tier]}
        </p>
      </div>
    </div>
  )
}
