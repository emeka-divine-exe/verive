'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateOrganizerProfile } from '@/lib/supabase/organizer'
import Link from 'next/link'

export default function OrganizerSettingsPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [twitter, setTwitter] = useState('')
  const [instagram, setInstagram] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) return
      setUser(auth.user)
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', auth.user.id).maybeSingle()
      if (prof) {
        setProfile(prof)
        setFullName(prof.full_name || '')
        setBio(prof.bio || '')
        setWebsite(prof.website || '')
        setTwitter(prof.twitter || '')
        setInstagram(prof.instagram || '')
        setAvatarUrl(prof.avatar_url || '')
        setCoverUrl(prof.cover_url || '')
      }
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError('')
    setSaved(false)

    try {
      await updateOrganizerProfile(user.id, {
        full_name: fullName,
        bio,
        website,
        twitter,
        instagram,
        avatar_url: avatarUrl || null,
        cover_url: coverUrl || null,
      })

      await supabase.auth.updateUser({ data: { full_name: fullName } })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err?.message || 'Unable to save organizer settings.')
    } finally {
      setSaving(false)
    }
  }

  const initials = fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'OR'

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-6">
        <Link href="/organizers/dashboard" className="text-sm font-body flex items-center gap-1.5 transition-colors" style={{ color: 'rgba(240,234,255,0.32)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Dashboard
        </Link>
      </div>

      <h1 className="h-lg mb-1" style={{ color: '#F0EAFF' }}>Organizer Settings</h1>
      <p className="font-body text-sm mb-8" style={{ color: 'rgba(240,234,255,0.35)' }}>
        Update your organizer profile. These details appear on your public organizer page.
      </p>

      <div className="flex items-center gap-5 mb-8 pb-8" style={{ borderBottom: '1px solid rgba(196,181,253,0.07)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-bold text-xl" style={{ background: 'rgba(123,63,228,0.25)', color: '#C4B5FD' }}>
          {initials}
        </div>
        <div>
          <p className="font-body text-sm font-semibold mb-1" style={{ color: '#F0EAFF' }}>Profile media</p>
          <p className="font-body text-xs" style={{ color: 'rgba(240,234,255,0.32)' }}>
            Use the media page to upload your logo and cover image into Supabase Storage.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="form-label">Organisation / Display name *</label>
          <input type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your organisation name" required />
        </div>

        <div>
          <label className="form-label">Bio</label>
          <textarea className="form-input" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell attendees what kind of events you run…" style={{ resize: 'vertical', minHeight: '100px' }} />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="form-label">Website</label>
            <input type="url" className="form-input" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourwebsite.com" />
          </div>
          <div>
            <label className="form-label">Twitter / X handle</label>
            <input type="text" className="form-input" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="@yourhandle" />
          </div>
          <div>
            <label className="form-label">Instagram handle</label>
            <input type="text" className="form-input" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@yourhandle" />
          </div>
          <div>
            <label className="form-label">Avatar URL</label>
            <input type="url" className="form-input" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="form-label">Cover URL</label>
            <input type="url" className="form-input" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://..." />
          </div>
        </div>

        {error && <p className="text-xs font-body text-red-400">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-pri px-8 py-3.5 text-sm">
            {saving ? 'Saving…' : 'Save Changes'}
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
