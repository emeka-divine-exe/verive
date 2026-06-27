'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { VerifiedBadge } from '@/components/VerifiedBadge'

type Role = 'user' | 'organizer'

export default function SignupPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [role,       setRole]       = useState<Role>('user')
  const [fullName,   setFullName]   = useState('')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [showPass,   setShowPass]   = useState(false)
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [googleLoad, setGoogleLoad] = useState(false)
  const [done,       setDone]       = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id, full_name: fullName, email, role: 'user', is_organizer: role === 'organizer', verified: false,
      })
    }
    setDone(true)
    setLoading(false)
  }

  async function handleGoogle() {
    setGoogleLoad(true)
    // Carry the selected role (Attendee/Organizer) through the OAuth redirect.
    // auth/callback/route.ts reads this and applies it ONLY when creating a brand-new
    // profile — it can never change the role of an account that already exists.
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?role=${role}` },
    })
  }
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden grid-bg px-4">
        <div className="orb w-96 h-96 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'rgba(194,130,13,0.10)' }} />
        <div className="auth-card relative z-10 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--v-gold-dim)', border: '1px solid var(--v-gold-border)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--v-gold)' }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h2 className="h-lg mb-3" style={{ color: 'var(--v-text)' }}>Check your inbox</h2>
          <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'var(--v-muted)' }}>
            We sent a verification link to{' '}
            <strong style={{ color: 'var(--v-gold)' }}>{email}</strong>.{' '}
            Click it to activate your account.
          </p>
          <Link href="/login" className="btn-ghost px-7 py-3 text-sm">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden grid-bg px-4 py-24">
      <div className="orb w-96 h-96 -right-32 top-0"           style={{ background: 'rgba(194,130,13,0.10)' }} />
      <div className="orb w-80 h-80 left-0 bottom-0 -translate-x-1/3" style={{ background: 'rgba(31,122,104,0.07)' }} />

      <div className="relative z-10 w-full flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <span className="font-display font-bold text-lg" style={{ color: 'var(--v-text)' }}>Verive</span>
          <span className="text-[0.55rem] font-body font-bold uppercase px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(194,130,13,0.14)', color: 'var(--v-gold)', letterSpacing: '0.1em' }}>
            Beta
          </span>
        </Link>

        <div className="auth-card">
          <h1 className="h-lg text-center mb-2" style={{ color: 'var(--v-text)' }}>Create an account</h1>
          <p className="text-center font-body text-sm mb-6" style={{ color: 'var(--v-muted)' }}>
            Join Verive and discover verified events worth showing up for
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {([
              { key: 'user',      label: "I'm an Attendee",  sub: 'Browse & bookmark events', icon: '🎟️' },
              { key: 'organizer', label: "I'm an Organizer", sub: 'Publish & manage events',  icon: '🎤' },
            ] as { key: Role; label: string; sub: string; icon: string }[]).map(({ key, label, sub, icon }) => (
              <button key={key} type="button" onClick={() => setRole(key)}
                className="p-4 rounded-2xl text-left transition-all"
                style={{
                  background: role === key ? 'var(--v-gold-dim)' : 'var(--v-border)',
                  border: `1px solid ${role === key ? 'var(--v-gold-border)' : 'var(--v-border-s)'}`,
                }}>
                <div className="text-xl mb-2">{icon}</div>
                <div className="font-display font-semibold text-xs mb-0.5" style={{ color: 'var(--v-text)' }}>
                  {label}
                </div>
                <div className="text-[0.65rem] font-body" style={{ color: 'var(--v-ghost)' }}>{sub}</div>
              </button>
            ))}
          </div>

          <button onClick={handleGoogle} disabled={googleLoad}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-body font-semibold text-sm transition-all mb-2"
            style={{ background: 'var(--v-border)', border: '1px solid var(--v-border-s)', color: 'var(--v-text)' }}>
            {googleLoad
              ? <svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            }
            Continue with Google
          </button>

          <div className="divider"><span>or sign up with email</span></div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="form-label">Full name</label>
              <input type="text" className="form-input" placeholder="Your full name"
                value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">Email address</label>
              <input type="email" className={`form-input ${error ? 'error' : ''}`}
                placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'}
                  className={`form-input pr-12 ${error ? 'error' : ''}`}
                  placeholder="At least 8 characters" value={password}
                  onChange={e => setPassword(e.target.value)} minLength={8} required />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--v-ghost)' }}>
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
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
                : `Create ${role === 'organizer' ? 'Organizer' : ''} Account`
              }
            </button>
          </form>

          <p className="text-center text-sm font-body mt-5" style={{ color: 'var(--v-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold" style={{ color: 'var(--v-gold)' }}>Log in</Link>
          </p>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <VerifiedBadge size={13} />
          <span className="text-xs font-body" style={{ color: 'var(--v-ghost)' }}>
            Secured by Supabase Auth
          </span>
        </div>
      </div>
    </div>
  )
                  }
