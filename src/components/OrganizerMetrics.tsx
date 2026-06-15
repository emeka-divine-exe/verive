'use client'
import { useEffect, useState } from 'react'
import { getOrganizerMetrics } from '@/lib/supabase/reviews'

const TIER_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'New',         color: 'var(--v-ghost)',  bg: 'var(--v-border)'    },
  2: { label: 'Rising',      color: 'var(--v-teal-l)', bg: 'var(--v-teal-dim)' },
  3: { label: 'Established', color: 'var(--v-teal-l)', bg: 'var(--v-teal-dim)' },
  4: { label: 'Top',         color: 'var(--v-gold)',   bg: 'var(--v-gold-dim)' },
  5: { label: 'Verified',    color: 'var(--v-gold)',   bg: 'var(--v-gold-dim)' },
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
        style={{ borderColor: 'var(--v-gold-dim)', borderTopColor: 'var(--v-gold)' }} />
    </div>
  )

  if (!metrics) return null

  const tier     = metrics.visibility_tier || 1
  const tierInfo = TIER_LABELS[tier]
  const trustPct = Math.round((metrics.trust_score || 0) * 100)

  return (
    <div className="gcard rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm"
          style={{ color: 'var(--v-text)', letterSpacing: '-0.01em' }}>
          Reputation Score
        </h3>
        <span className="text-xs font-body font-semibold px-3 py-1 rounded-lg"
          style={{ background: tierInfo.bg, color: tierInfo.color }}>
          {tierInfo.label}
        </span>
      </div>

      {/* Trust bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-xs" style={{ color: 'var(--v-ghost)' }}>Trust Score</span>
          <span className="font-display font-bold text-sm" style={{ color: 'var(--v-gold)' }}>
            {trustPct}%
          </span>
        </div>
        <div className="prog-bar">
          <div className="prog-fill" style={{ width: `${trustPct}%`, transition: 'width 0.8s ease' }} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Events',     val: metrics.event_count   || 0 },
          { label: 'Reviews',    val: metrics.total_reviews || 0 },
          { label: 'Avg Rating', val: metrics.average_rating ? `${Number(metrics.average_rating).toFixed(1)}★` : '—' },
        ].map(({ label, val }) => (
          <div key={label} className="text-center p-3 rounded-xl"
            style={{ background: 'var(--v-border)', border: '1px solid var(--v-border-s)' }}>
            <p className="font-display font-bold text-lg" style={{ color: 'var(--v-text)' }}>{val}</p>
            <p className="font-body text-[0.6rem]" style={{ color: 'var(--v-ghost)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      {metrics.average_rating > 0 && (
        <div className="space-y-2">
          <p className="font-body text-xs mb-3" style={{ color: 'var(--v-ghost)' }}>Rating breakdown</p>
          <div className="flex items-center gap-3">
            <span className="font-body text-xs w-24 flex-shrink-0" style={{ color: 'var(--v-ghost)' }}>
              Overall
            </span>
            <div className="flex-1 prog-bar">
              <div className="prog-fill" style={{ width: `${(metrics.average_rating / 5) * 100}%` }} />
            </div>
            <span className="font-body text-xs w-8 text-right flex-shrink-0" style={{ color: 'var(--v-gold)' }}>
              {Number(metrics.average_rating).toFixed(1)}
            </span>
          </div>
        </div>
      )}

      {/* Milestone */}
      <div className="pt-2" style={{ borderTop: '1px solid var(--v-border)' }}>
        <p className="font-body text-xs" style={{ color: 'var(--v-ghost)' }}>
          {NEXT_MILESTONE[tier]}
        </p>
      </div>
    </div>
  )
              }
