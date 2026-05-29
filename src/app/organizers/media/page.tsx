'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { deletePublicFile, pathFromPublicUrl, uploadPublicFile } from '@/lib/supabase/storage'
import { updateOrganizerProfile } from '@/lib/supabase/organizer'

export default function OrganizerMediaPage() {
  const supabase = createClient()
  const [userId, setUserId] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<'avatar' | 'cover' | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) return
      setUserId(auth.user.id)
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url,cover_url')
        .eq('id', auth.user.id)
        .maybeSingle()
      if (profile) {
        setAvatarUrl(profile.avatar_url || '')
        setCoverUrl(profile.cover_url || '')
      }
    }
    load()
  }, [])

  async function handleUpload(kind: 'avatar' | 'cover', file: File | null) {
    if (!file || !userId) return
    setUploading(kind)
    setMessage('')

    try {
      const bucket = kind === 'avatar' ? 'avatars' : 'covers'
      const folder = `organizers/${userId}`
      const result = await uploadPublicFile(bucket, folder, file)

      if (kind === 'avatar') {
        setAvatarUrl(result.url)
        setAvatarPreview(result.url)
      } else {
        setCoverUrl(result.url)
        setCoverPreview(result.url)
      }

      await updateOrganizerProfile(userId, {
        avatar_url: kind === 'avatar' ? result.url : avatarUrl || null,
        cover_url: kind === 'cover' ? result.url : coverUrl || null,
      })

      setMessage(`${kind === 'avatar' ? 'Avatar' : 'Cover'} uploaded successfully.`)
    } catch (err: any) {
      setMessage(err?.message || 'Upload failed.')
    } finally {
      setUploading(null)
    }
  }

  async function handleRemove(kind: 'avatar' | 'cover') {
    if (!userId) return

    const currentUrl = kind === 'avatar' ? avatarUrl : coverUrl
    if (!currentUrl) return

    setLoading(true)

    try {
      const bucket = kind === 'avatar' ? 'avatars' : 'covers'
      const path = pathFromPublicUrl(currentUrl, bucket)
      if (path) await deletePublicFile(bucket, path)

      if (kind === 'avatar') {
        setAvatarUrl('')
        setAvatarPreview('')
      } else {
        setCoverUrl('')
        setCoverPreview('')
      }

      await updateOrganizerProfile(userId, {
        avatar_url: kind === 'avatar' ? null : avatarUrl || null,
        cover_url: kind === 'cover' ? null : coverUrl || null,
      })

      setMessage(`${kind === 'avatar' ? 'Avatar' : 'Cover'} removed.`)
    } catch (err: any) {
      setMessage(err?.message || 'Could not remove media.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="h-lg mb-1" style={{ color: '#F0EAFF' }}>Media Library</h1>
          <p className="font-body text-sm" style={{ color: 'rgba(240,234,255,0.35)' }}>
            Upload organizer branding assets into Supabase Storage.
          </p>
        </div>
        <Link href="/organizers/settings" className="btn-ghost px-5 py-3 text-sm">Back to Settings</Link>
      </div>

      {message && (
        <div className="gcard rounded-2xl p-4 mb-6 text-sm font-body" style={{ color: '#F0EAFF' }}>
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {[
          { key: 'avatar' as const, title: 'Avatar / Logo', bucket: 'avatars', preview: avatarPreview || avatarUrl, current: avatarUrl },
          { key: 'cover' as const, title: 'Cover Image', bucket: 'covers', preview: coverPreview || coverUrl, current: coverUrl },
        ].map((item) => (
          <div key={item.key} className="gcard rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 className="h-md" style={{ color: '#F0EAFF' }}>{item.title}</h2>
              <span className="text-xs font-body px-2.5 py-1 rounded-full" style={{ background: 'rgba(123,63,228,0.14)', color: '#C4B5FD' }}>
                {item.bucket}
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden mb-5" style={{ minHeight: item.key === 'avatar' ? '220px' : '240px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,181,253,0.12)' }}>
              {item.preview ? (
                <img src={item.preview} alt={item.title} className="w-full h-full object-cover" style={{ minHeight: item.key === 'avatar' ? '220px' : '240px' }} />
              ) : (
                <div className="flex items-center justify-center h-full py-16">
                  <p className="text-sm font-body" style={{ color: 'rgba(240,234,255,0.32)' }}>No {item.title.toLowerCase()} uploaded yet.</p>
                </div>
              )}
            </div>

            <label className="btn-pri inline-flex text-white font-semibold px-5 py-3 text-sm cursor-pointer">
              {uploading === item.key ? 'Uploading…' : `Upload ${item.title}`}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(item.key, e.target.files?.[0] || null)}
              />
            </label>

            {item.current && (
              <button
                onClick={() => handleRemove(item.key)}
                disabled={loading}
                className="btn-ghost px-5 py-3 text-sm ml-3"
                style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'rgba(248,113,113,0.8)' }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
