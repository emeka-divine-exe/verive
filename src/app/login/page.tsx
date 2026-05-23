'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { VerifiedBadge } from '@/components/VerifiedBadge'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [googleLoad,setGoogleLoad]= useState(false)
  const [showPass,  setShowPass]  = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Get role and redirect
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role === 'organizer' || profile?.role === 'admin') {
        router.push('/organizer/dashboard')
      } else {
        router.push('/dashboard')
      }
    }
    router.refresh()
  }

  async function handleGoogle() {
    setGoogleLoad(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden grid-bg px-4 py-24">
      <div className="orb w-96 h-96 -left-32 top-0" style={{ background: 'rgba(123,63,228,0.18)' }} />
      <div className="orb w-80 h-80 right-0 bottom-0 translate-x-1/3" style={{ background: 'rgba(196,181,253,0.06)' }} />

      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center glow" style={{ background: '#7B3FE4' }}>
            <span className="font-display font-bold text-white text-base">V</span>
          </div>
          <span className="font-display font-bold text-lg" style={{ color: '#F0EAFF' }}>
            Verivent<span style={{ color: '#7B3FE4' }}>.</span>
          </span>
        </Link>

        <div className="auth-card">
          <h1 className="h-lg text-center mb-2" style={{ color: '#F0EAFF' }}>Welcome back</h1>
          <p className="text-center font-body text-sm mb-8" style={{ color: 'rgba(240,234,255,0.38)' }}>
            Log in to your Verivent account
          </p>

          {/* Google */}
          <button onClick={handleGoogle} disabled={googleLoad}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-body font-semibold text-sm transition-all mb-2"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,181,253,0.15)', color: '#F0EAFF' }}>
            {googleLoad ? (
              <svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            )}
            Continue with Google
          </button>

          <div className="divider"><span>or continue with email</span></div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="form-label">Email address</label>
              <input type="email" className={`form-input ${error ? 'error' : ''}`}
                placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <Link href="/forgot-password" className="text-xs font-body transition-colors" style={{ color: '#7B3FE4' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'}
                  className={`form-input pr-12 ${error ? 'error' : ''}`}
                  placeholder="Enter your password" value={password}
                  onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(240,234,255,0.3)' }}>
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

            <button type="submit" disabled={loading} className="btn-pri w-full py-4 rounded-2xl text-base mt-2">
              {loading ? (
                <svg className="spinner w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
              ) : 'Log In'}
            </button>
          </form>

          <p className="text-center text-sm font-body mt-6" style={{ color: 'rgba(240,234,255,0.35)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold transition-colors" style={{ color: '#C4B5FD' }}>
              Sign up
            </Link>
          </p>
        </div>

        {/* Trust signal */}
        <div className="flex items-center gap-2 mt-6">
          <VerifiedBadge size={13} />
          <span className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.22)' }}>
            Secured by Supabase Auth
          </span>
        </div>
      </div>
    </div>
  )
}
