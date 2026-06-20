'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { OrganizerMetrics } from '@/components/OrganizerMetrics'
import { VerifiedBadge } from '@/components/VerifiedBadge'

type RequestStatus = 'none' | 'pending' | 'approved' | 'rejected'

export default function OrganizerApplyPage() {
  const supabase = createClient()

  const [userId,        setUserId]        = useState<string | null>(null)
  const [isVerified,    setIsVerified]    = useState(false)
  const [status,        setStatus]        = useState<RequestStatus>('none')
  const [submittedAt,   setSubmittedAt]   = useState<string | null>(null)
  const [adminNote,      setAdminNote]      = useState<string | null>(null)

  const [message,  setMessage]  = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [submitting,  setSubmitting]  = useState(false)
  const [error,       setError]       = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      const { data: auth } = await supabase.auth.getUser()
      if (!mounted) return
      if (!auth.user) { setPageLoading(false); return }
      setUserId(auth.user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('verified')
        .eq('id', auth.user.id)
        .maybeSingle()
      if (!mounted) return
      setIsVerified(profile?.verified === true)

      const { data: lastRequest } = await supabase
        .from('verification_requests')
        .select('status, created_at, admin_note')
        .eq('organizer_id', auth.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!mounted) return
      if (lastRequest) {
        setStatus(lastRequest.status as RequestStatus)
        setSubmittedAt(lastRequest.created_at)
        setAdminNote(lastRequest.admin_note || null)
      }
      setPageLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!message.trim()) {
      setError('Tell us a little about your events before applying.')
      return
    }
    if (!userId) {
      setError('Your session expired. Please log in again.')
      return
    }

    setSubmitting(true)
    try {
      const { error: insertError } = await supabase.from('verification_requests').insert({
        organizer_id: userId,
        message: message.trim(),
        status: 'pending',
      })
      if (insertError) throw insertError

      setStatus('pending')
      setSubmittedAt(new Date().toISOString())
    } catch (err) {
      console.error('verification request failed', err)
      setError('We could not submit your application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="p-6 md:p-10 max-w-2xl">
        <div className="py-24 flex justify-center">
          <svg className="spinner w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="var(--v-gold)" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
            <path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="h-lg mb-1" style={{ color: 'var(--v-text)' }}>Verification</h1>
      <p className="font-body text-sm mb-8" style={{ color: 'var(--v-muted)' }}>
        Verified status is earned through your track record, not granted on request — but applying gives our team
        the context to review you sooner.
      </p>

      {userId && (
        <div className="mb-8">
          <OrganizerMetrics organizerId={userId} />
        </div>
      )}

      {isVerified ? (
        <div className="gcard rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <VerifiedBadge size={22} />
            <span className="font-display font-semibold" style={{ color: 'var(--v-text)' }}>You're verified</span>
          </div>
          <p className="font-body text-sm" style={{ color: 'var(--v-muted)' }}>
            Your badge is live across your organizer profile. Keep your event quality and ratings up to keep it.
          </p>
        </div>
      ) : status === 'pending' ? (
        <div className="gcard rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--v-gold-dim)', border: '1px solid var(--v-gold-border)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--v-gold)' }}>
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h2 className="font-display font-semibold mb-2" style={{ color: 'var(--v-text)', fontSize: '1rem' }}>
            Application under review
          </h2>
          <p className="font-body text-sm" style={{ color: 'var(--v-muted)' }}>
            Submitted {submittedAt ? new Date(submittedAt).toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' }) : 'recently'}.
            Our team reviews applications alongside your event history and ratings.
          </p>
        </div>
      ) : (
        <>
          {status === 'rejected' && (
            <div className="gcard rounded-2xl p-5 mb-6" style={{ borderColor: 'rgba(239,68,68,0.25)' }}>
              <p className="font-body text-sm font-semibold mb-1" style={{ color: '#FCA5A5' }}>
                Your last application wasn't approved
              </p>
              {adminNote && (
                <p className="font-body text-xs" style={{ color: 'var(--v-muted)' }}>{adminNote}</p>
              )}
              <p className="font-body text-xs mt-2" style={{ color: 'var(--v-muted)' }}>
                You're welcome to apply again once you've posted more events or built up your rating.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Tell us about your events</label>
              <textarea className="form-input" rows={6} value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="What kind of events do you run, how often, and why should Verive verify you?"
                style={{ resize: 'vertical', minHeight: '140px' }} required />
            </div>

            {error && (
              <p className="text-xs font-body text-red-400 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={submitting} className="btn-pri px-8 py-3.5 text-sm">
                {submitting
                  ? <svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                  : 'Submit Application'
                }
              </button>
              <Link href="/organizers/dashboard" className="btn-ghost px-6 py-3.5 text-sm">Back to Dashboard</Link>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
