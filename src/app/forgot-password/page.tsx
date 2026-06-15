'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden grid-bg px-4 py-24">
      <div className="orb w-96 h-96 left-1/2 top-1/4 -translate-x-1/2" style={{ background: 'rgba(194,130,13,0.09)' }} />

      <div className="relative z-10 w-full flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <span className="font-display font-bold text-lg" style={{ color: 'var(--v-text)' }}>Verive</span>
          <span className="text-[0.55rem] font-body font-bold uppercase px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(194,130,13,0.14)', color: 'var(--v-gold)', letterSpacing: '0.1em' }}>
            Beta
          </span>
        </Link>

        <div className="auth-card">
          {done ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'var(--v-gold-dim)', border: '1px solid var(--v-gold-border)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--v-gold)' }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h2 className="h-md mb-3" style={{ color: 'var(--v-text)' }}>Check your inbox</h2>
              <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'var(--v-muted)' }}>
                We sent a reset link to{' '}
                <strong style={{ color: 'var(--v-gold)' }}>{email}</strong>. It expires in 1 hour.
              </p>
              <Link href="/login" className="btn-ghost px-7 py-3 text-sm">Back to Login</Link>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'var(--v-gold-dim)', border: '1px solid var(--v-gold-border)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--v-gold)' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h1 className="h-lg mb-2" style={{ color: 'var(--v-text)' }}>Reset password</h1>
              <p className="font-body text-sm mb-7" style={{ color: 'var(--v-muted)' }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Email address</label>
                  <input type="email" className={`form-input ${error ? 'error' : ''}`}
                    placeholder="you@example.com" value={email}
                    onChange={e => setEmail(e.target.value)} required />
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
                    : 'Send Reset Link'
                  }
                </button>
              </form>
              <p className="text-center text-sm font-body mt-5" style={{ color: 'var(--v-muted)' }}>
                Remember it?{' '}
                <Link href="/login" className="font-semibold" style={{ color: 'var(--v-gold)' }}>Back to login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
