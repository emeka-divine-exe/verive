'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function OrganizerSettingsPage() {
  const supabase = createClient()
  const [user,     setUser]    = useState<any>(null)
  const [profile,  setProfile] = useState<any>(null)
  const [fullName, setFullName]= useState('')
  const [bio,      setBio]     = useState('')
  const [website,  setWebsite] = useState('')
  const [twitter,  setTwitter] = useState('')
  const [instagram,setInstagram]=useState('')
  const [saving,   setSaving]  = useState(false)
  const [saved,    setSaved]   = useState(false)
  const [error,    setError]   = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (prof) {
        setProfile(prof)
        setFullName(prof.full_name || '')
        setBio(prof.bio || '')
        setWebsite(prof.website || '')
        setTwitter(prof.twitter || '')
        setInstagram(prof.instagram || '')
      }
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(''); setSaved(false)
    const { error } = await supabase.from('profiles').update({
      full_name: fullName, bio, website, twitter, instagram,
    }).eq('id', user.id)
    await supabase.auth.updateUser({ data: { full_name: fullName } })
    if (error) { setError(error.message); setSaving(false); return }
    setSaved(true); setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'OR'

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="h-lg mb-1" style={{ color: '#F0EAFF' }}>Organizer Settings</h1>
      <p className="font-body text-sm mb-8" style={{ color: 'rgba(240,234,255,0.35)' }}>
        Update your organizer profile. This is what attendees see.
      </p>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 pb-8" style={{ borderBottom: '1px solid rgba(196,181,253,0.07)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-bold text-xl"
          style={{ background: 'rgba(123,63,228,0.25)', color: '#C4B5FD' }}>{initials}</div>
        <div>
          <p className="font-body text-sm font-semibold mb-1" style={{ color: '#F0EAFF' }}>Profile photo</p>
          <p className="font-body text-xs" style={{ color: 'rgba(240,234,255,0.32)' }}>
            Logo/avatar upload coming with Supabase Storage in next phase.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="form-label">Organisation / Display name *</label>
          <input type="text" className="form-input" value={fullName}
            onChange={e => setFullName(e.target.value)} placeholder="Your organisation name" required />
        </div>

        <div>
          <label className="form-label">Email</label>
          <input type="email" className="form-input" value={user?.email || ''} disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }} />
        </div>

        <div>
          <label className="form-label">Bio</label>
          <textarea className="form-input" rows={4} value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell attendees what kind of events you run…"
            style={{ resize: 'vertical', minHeight: '100px' }} />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="form-label">Website</label>
            <input type="url" className="form-input" value={website}
              onChange={e => setWebsite(e.target.value)} placeholder="https://yourwebsite.com" />
          </div>
          <div>
            <label className="form-label">Twitter / X handle</label>
            <input type="text" className="form-input" value={twitter}
              onChange={e => setTwitter(e.target.value)} placeholder="@yourhandle" />
          </div>
          <div>
            <label className="form-label">Instagram handle</label>
            <input type="text" className="form-input" value={instagram}
              onChange={e => setInstagram(e.target.value)} placeholder="@yourhandle" />
          </div>
        </div>

        {error && <p className="text-xs font-body text-red-400">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-pri px-8 py-3.5 text-sm">
            {saving
              ? <svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
              : 'Save Changes'
            }
          </button>
          {saved && (
            <span className="text-xs font-body text-emerald-400 flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
