'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [done,     setDone]     = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm)   { setError('Passwords do not match.'); return }
    if (password.length < 8)    { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
    setTimeout(() => router.push('/login'), 2500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden grid-bg px-4 py-24">
      <div className="orb w-96 h-96 left-1/2 top-1/4 -translate-x-1/2"
        style={{ background: 'rgba(194,130,13,0.09)' }} />

      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <span className="font-display font-bold text-lg" style={{ color: '#F0E8D6' }}>Verive</span>
          <span className="text-[0.55rem] font-body font-bold uppercase px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(194,130,13,0.14)', color: '#C2820D', letterSpacing: '0.1em' }}>
            Beta
          </span>
        </Link>

        <div className="auth-card">
          {done ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h2 className="h-md mb-2" style={{ color: '#F0E8D6' }}>Password updated!</h2>
              <p className="font-body text-sm" style={{ color: 'rgba(240,232,214,0.42)' }}>
                Redirecting you to login…
              </p>
            </div>
          ) : (
            <>
              <h1 className="h-lg mb-2" style={{ color: '#F0E8D6' }}>Set new password</h1>
              <p className="font-body text-sm mb-7" style={{ color: 'rgba(240,232,214,0.40)' }}>
                Choose a strong password for your account.
              </p>
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="form-label">New password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'}
                      className={`form-input pr-12 ${error ? 'error' : ''}`}
                      placeholder="At least 8 characters" value={password}
                      onChange={e => setPassword(e.target.value)} required />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgba(240,232,214,0.30)' }}>
                      {showPass
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>
                <div>
                  <label className="form-label">Confirm password</label>
                  <input type={showPass ? 'text' : 'password'}
                    className={`form-input ${error ? 'error' : ''}`}
                    placeholder="Repeat your password" value={confirm}
                    onChange={e => setConfirm(e.target.value)} required />
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
                    : 'Update Password'
                  }
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
