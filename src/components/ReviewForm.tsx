'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { hasAttended, hasReviewed, submitReview, getEventReviewStats } from '@/lib/supabase/reviews'

interface Props { eventId: string }

const METRICS = [
  { key: 'speaker_score',    label: 'Speakers',      sub: 'Quality and usefulness of speakers'   },
  { key: 'execution_score',  label: 'Execution',     sub: 'Timing, logistics, and organisation'  },
  { key: 'networking_score', label: 'Networking',    sub: 'Quality of connections made'          },
  { key: 'value_score',      label: 'Overall Value', sub: 'Was it worth your time?'              },
] as const

type MetricKey = typeof METRICS[number]['key']

export function ReviewForm({ eventId }: Props) {
  const supabase = createClient()
  const [userId,       setUserId]       = useState<string | null>(null)
  const [attended,     setAttended]     = useState(false)
  const [reviewed,     setReviewed]     = useState(false)
  const [scores,       setScores]       = useState<Record<MetricKey, number>>({
    speaker_score: 0, execution_score: 0, networking_score: 0, value_score: 0,
  })
  const [submitting,   setSubmitting]   = useState(false)
  const [submitted,    setSubmitted]    = useState(false)
  const [error,        setError]        = useState('')
  const [stats,        setStats]        = useState<Awaited<ReturnType<typeof getEventReviewStats>>>(null)
  const [loadingState, setLoadingState] = useState(true)

  useEffect(() => {
    let mounted = true
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!mounted) return
      if (!user) { setLoadingState(false); return }
      setUserId(user.id)
      const [att, rev, reviewStats] = await Promise.all([
        hasAttended(eventId, user.id),
        hasReviewed(eventId, user.id),
        getEventReviewStats(eventId),
      ])
      if (!mounted) return
      setAttended(att)
      setReviewed(rev)
      setStats(reviewStats)
      setLoadingState(false)
    }
    init()
    return () => { mounted = false }
  }, [eventId])

  async function handleSubmit() {
    if (!userId) return
    const incomplete = (Object.values(scores) as number[]).some(s => s === 0)
    if (incomplete) { setError('Please rate all four categories.'); return }
    setSubmitting(true)
    setError('')
    const { error: submitErr } = await submitReview({ event_id: eventId, user_id: userId, ...scores })
    if (submitErr) { setError(submitErr.message); setSubmitting(false); return }
    const updatedStats = await getEventReviewStats(eventId)
    setStats(updatedStats)
    setSubmitted(true)
    setSubmitting(false)
  }

  if (loadingState) return null

  return (
    <div className="gcard rounded-2xl p-6 mt-6">
      <h3 className="font-display font-semibold text-base mb-4"
        style={{ color: 'var(--v-text)', letterSpacing: '-0.01em' }}>
        Community Reviews
      </h3>

      {/* Stats */}
      {stats && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-display font-bold text-3xl" style={{ color: 'var(--v-gold)' }}>
              {stats.overallAvg.toFixed(1)}
            </span>
            <div>
              <div className="flex gap-0.5 mb-0.5">
                {[1,2,3,4,5].map(n => (
                  <svg key={n} width="12" height="12" viewBox="0 0 24 24"
                    fill={n <= Math.round(stats.overallAvg) ? 'currentColor' : 'none'}
                    stroke="currentColor" strokeWidth="2"
                    style={{ color: 'var(--v-gold)' }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <p className="font-body text-xs" style={{ color: 'var(--v-ghost)' }}>
                {stats.count} review{stats.count !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Worth attending */}
          <div className="px-4 py-3 rounded-xl mb-4"
            style={{ background: 'var(--v-teal-dim)', border: '1px solid var(--v-teal-border)' }}>
            <p className="font-body text-sm font-semibold" style={{ color: 'var(--v-teal-l)' }}>
              {stats.worthAttending}% of attendees said this event was worth showing up for
            </p>
          </div>

          {/* Breakdown */}
          <div className="space-y-2.5">
            {[
              { label: 'Speakers',   val: stats.avgSpeaker    },
              { label: 'Execution',  val: stats.avgExecution  },
              { label: 'Networking', val: stats.avgNetworking },
              { label: 'Value',      val: stats.avgValue      },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="font-body text-xs w-20 flex-shrink-0" style={{ color: 'var(--v-ghost)' }}>
                  {label}
                </span>
                <div className="flex-1 prog-bar">
                  <div className="prog-fill" style={{ width: `${(val / 5) * 100}%` }} />
                </div>
                <span className="font-body text-xs w-6 text-right flex-shrink-0"
                  style={{ color: 'var(--v-gold)' }}>
                  {val.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form state */}
      {!userId ? (
        <p className="font-body text-sm" style={{ color: 'var(--v-ghost)' }}>
          <a href="/login" style={{ color: 'var(--v-gold)' }}>Log in</a> to leave a review.
        </p>
      ) : !attended ? (
        <p className="font-body text-sm" style={{ color: 'var(--v-ghost)' }}>
          Only verified attendees can submit reviews. Mark your attendance on this event page.
        </p>
      ) : reviewed || submitted ? (
        <div className="flex items-center gap-2 p-4 rounded-xl"
          style={{ background: 'var(--v-teal-dim)', border: '1px solid var(--v-teal-border)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" style={{ color: 'var(--v-teal-l)' }}>
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          <span className="font-body text-sm font-semibold" style={{ color: 'var(--v-teal-l)' }}>
            {submitted ? 'Review submitted — thank you.' : 'You have already reviewed this event.'}
          </span>
        </div>
      ) : (
        <div>
          <p className="font-body text-sm mb-5" style={{ color: 'var(--v-muted)' }}>
            Rate your experience across four dimensions:
          </p>
          <div className="space-y-5 mb-6">
            {METRICS.map(({ key, label, sub }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body text-sm font-semibold" style={{ color: 'var(--v-text)' }}>
                    {label}
                  </span>
                  <span className="font-body text-xs" style={{ color: 'var(--v-ghost)' }}>{sub}</span>
                </div>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button"
                      onClick={() => setScores(s => ({ ...s, [key]: n }))}
                      className="w-10 h-10 rounded-xl font-display font-bold text-sm transition-all"
                      style={{
                        background: scores[key] >= n ? 'var(--v-gold-dim)' : 'var(--v-border)',
                        color:      scores[key] >= n ? 'var(--v-gold)'     : 'var(--v-ghost)',
                        border:     `1px solid ${scores[key] >= n ? 'var(--v-gold-border)' : 'var(--v-border-s)'}`,
                      }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {error && <p className="text-xs font-body text-red-400 mb-4">{error}</p>}
          <button onClick={handleSubmit} disabled={submitting} className="btn-pri px-7 py-3 text-sm">
            {submitting
              ? <svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                  <path d="M12 2a10 10 0 0 1 10 10"/>
                </svg>
              : 'Submit Review'
            }
          </button>
        </div>
      )}
    </div>
  )
                }
