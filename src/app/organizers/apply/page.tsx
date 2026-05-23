'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { VerifiedBadge } from '@/components/VerifiedBadge'

export default function ApplyVerifiedPage() {
  const supabase = createClient()
  const [form, setForm] = useState({
    orgName: '', website: '', socialLink: '', pastEvents: '', whyVerify: '',
  })
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('You must be logged in.'); setLoading(false); return }

    const { error } = await supabase.from('verification_requests').insert({
      user_id:     user.id,
      org_name:    form.orgName,
      website:     form.website,
      social_link: form.socialLink,
      past_events: form.pastEvents,
      why_verify:  form.whyVerify,
      status:      'pending',
    })

    if (error) { setError(error.message); setLoading(false); return }
    setDone(true); setLoading(false)
  }

  if (done) return (
    <div className="p-6 md:p-10 max-w-lg">
      <div className="gcard rounded-3xl p-12 text-center anim-border">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(123,63,228,0.2)', border: '1px solid rgba(196,181,253,0.2)' }}>
          <VerifiedBadge size={30} />
        </div>
        <h2 className="h-lg mb-3" style={{ color: '#F0EAFF' }}>Request submitted!</h2>
        <p className="font-body text-sm mb-2 leading-relaxed" style={{ color: 'rgba(240,234,255,0.4)' }}>
          We&apos;ve received your verification request. Our team will review it and get back to you within 3–5 business days.
        </p>
        <p className="font-body text-xs mb-7" style={{ color: 'rgba(240,234,255,0.28)' }}>
          If approved, your verified badge will appear automatically on your profile and all your events.
        </p>
        <Link href="/organizer/dashboard" className="btn-pri text-white font-semibold px-8 py-3 text-sm">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <Link href="/organizer/dashboard" className="inline-flex items-center gap-2 text-sm font-body mb-6 transition-colors"
        style={{ color: 'rgba(240,234,255,0.32)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1"
          style={{ background: 'rgba(123,63,228,0.18)', border: '1px solid rgba(196,181,253,0.18)' }}>
          <VerifiedBadge size={22} />
        </div>
        <div>
          <h1 className="h-lg mb-1" style={{ color: '#F0EAFF' }}>Request Verified Badge</h1>
          <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(240,234,255,0.38)' }}>
            The verified badge shows attendees that you&apos;re a trusted, vetted organizer on Verivent.
            Fill in the form below and our team will review your application.
          </p>
        </div>
      </div>

      {/* What it means */}
      <div className="gcard rounded-2xl p-5 mb-8">
        <p className="text-xs font-body font-semibold mb-3" style={{ color: 'rgba(240,234,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          What verification means
        </p>
        <div className="space-y-2">
          {[
            'Your verified badge appears on your profile and all your events',
            'Attendees see you as a trusted, reviewed organiser',
            'Your events get higher visibility in the discovery feed',
            'Direct publishing privileges (coming soon)',
          ].map(item => (
            <div key={item} className="flex items-start gap-2.5">
              <VerifiedBadge size={13} />
              <span className="font-body text-sm" style={{ color: 'rgba(240,234,255,0.5)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="form-label">Organisation / Event brand name *</label>
          <input type="text" className="form-input" placeholder="e.g. GDG Lagos"
            value={form.orgName} onChange={set('orgName')} required />
        </div>

        <div>
          <label className="form-label">Website or landing page</label>
          <input type="url" className="form-input" placeholder="https://yourwebsite.com"
            value={form.website} onChange={set('website')} />
        </div>

        <div>
          <label className="form-label">Social media link (Instagram, Twitter, or LinkedIn) *</label>
          <input type="url" className="form-input"
            placeholder="https://instagram.com/yourhandle"
            value={form.socialLink} onChange={set('socialLink')} required />
        </div>

        <div>
          <label className="form-label">Describe past events you&apos;ve organised *</label>
          <textarea className="form-input" rows={4}
            placeholder="List 2–3 events you've run. Include names, dates, and approximate attendance."
            value={form.pastEvents} onChange={set('pastEvents')} required
            style={{ resize: 'vertical', minHeight: '110px' }} />
        </div>

        <div>
          <label className="form-label">Why do you want to be verified on Verivent? *</label>
          <textarea className="form-input" rows={3}
            placeholder="Tell us about your events and why you'd be a good fit for the platform."
            value={form.whyVerify} onChange={set('whyVerify')} required
            style={{ resize: 'vertical', minHeight: '90px' }} />
        </div>

        {error && (
          <p className="text-xs font-body text-red-400 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-pri w-full py-4 rounded-2xl text-base">
          {loading
            ? <svg className="spinner w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            : 'Submit Verification Request'
          }
        </button>

        <p className="text-xs font-body text-center" style={{ color: 'rgba(240,234,255,0.22)' }}>
          We review all applications manually. You&apos;ll hear from us within 3–5 business days.
        </p>
      </form>
    </div>
  )
}
