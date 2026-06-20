'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const supabase = createClient()
  const router   = useRouter()
  const [user,      setUser]      = useState<any>(null)
  const [fullName,  setFullName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [error,     setError]     = useState('')
  const [deleting,  setDeleting]  = useState(false)
  const [confirmDel,setConfirmDel]= useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      setUser(data.user)
      setFullName(data.user.user_metadata?.full_name || '')
      setEmail(data.user.email || '')
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(''); setSaved(false)
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    })
    if (error) { setError(error.message); setSaving(false); return }
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
    setSaved(true); setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error || 'We could not delete your account. Please try again.')
        setDeleting(false)
        return
      }
      await supabase.auth.signOut()
      router.push('/')
    } catch {
      setError('We could not delete your account. Please try again.')
      setDeleting(false)
    }
  }
  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="h-lg mb-1" style={{ color: '#F0EAFF' }}>Account Settings</h1>
      <p className="font-body text-sm mb-10" style={{ color: 'rgba(240,234,255,0.35)' }}>Manage your profile and preferences.</p>

      {/* Profile section */}
      <div className="gcard rounded-2xl p-7 mb-5">
        <h2 className="h-sm mb-6" style={{ color: '#F0EAFF' }}>Profile</h2>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="form-label">Full name</label>
            <input type="text" className="form-input" value={fullName}
              onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
          </div>
          <div>
            <label className="form-label">Email address</label>
            <input type="email" className="form-input" value={email} disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }} />
            <p className="text-xs font-body mt-1.5" style={{ color: 'rgba(240,234,255,0.25)' }}>
              Email cannot be changed. Contact support if needed.
            </p>
          </div>
          {error && <p className="text-xs text-red-400 font-body">{error}</p>}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-pri px-7 py-3 text-sm">
              {saving
                ? <svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                : 'Save Changes'
              }
            </button>
            {saved && <span className="text-xs font-body text-emerald-400 flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              Saved
            </span>}
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="gcard rounded-2xl p-7" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
        <h2 className="h-sm mb-2" style={{ color: '#F0EAFF' }}>Danger Zone</h2>
        <p className="font-body text-sm mb-5" style={{ color: 'rgba(240,234,255,0.35)' }}>
          Once you delete your account, all your data will be permanently removed. This cannot be undone.
        </p>
        {!confirmDel ? (
          <button onClick={() => setConfirmDel(true)}
            className="btn-ghost px-6 py-2.5 text-sm" style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.7)' }}>
            Delete Account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={handleDeleteAccount} disabled={deleting}
              className="px-6 py-2.5 text-sm rounded-full font-body font-semibold transition-all"
              style={{ background: 'rgba(239,68,68,0.18)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
              {deleting ? 'Deleting…' : 'Yes, delete my account'}
            </button>
            <button onClick={() => setConfirmDel(false)} className="btn-ghost px-5 py-2.5 text-sm">Cancel</button>
          </div>
        )}
      </div>
    </div>
  )
}
