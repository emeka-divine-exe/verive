'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { createOrganizerEvent } from '@/lib/supabase/organizer'
import { uploadPublicFile } from '@/lib/supabase/storage'
import { CATEGORY_META, FORMAT_META, CATEGORY_ORDER, type Category, type Format } from '@/lib/data'

const FORMATS: Format[] = ['in-person', 'online', 'hybrid']

export default function NewEventPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])

  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [longDesc,     setLongDesc]    = useState('')
  const [category,     setCategory]    = useState<Category>('tech')
  const [format,       setFormat]      = useState<Format>('in-person')
  const [date,         setDate]        = useState('')
  const [time,         setTime]        = useState('')
  const [location,     setLocation]    = useState('')
  const [isFree,       setIsFree]      = useState(true)
  const [price,        setPrice]       = useState('')
  const [capacity,     setCapacity]    = useState('')
  const [ticketUrl,    setTicketUrl]   = useState('')
  const [imageUrl,     setImageUrl]    = useState('')

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError,     setImageError]     = useState('')

  async function handleImageUpload(file: File | null) {
    if (!file) return
    setUploadingImage(true)
    setImageError('')
    try {
      const folder = userId ? `events/${userId}` : 'events/unassigned'
      const result = await uploadPublicFile('event-images', folder, file)
      setImageUrl(result.url)
    } catch (err) {
      console.error('event image upload failed', err)
      setImageError('Could not upload that image. Try a smaller file or a different format.')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!title.trim() || !description.trim() || !date || !time || !location.trim()) {
      setError('Please fill in title, description, date, time, and location.')
      return
    }

    setLoading(true)
    try {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) {
        setError('Your session expired. Please log in again.')
        setLoading(false)
        return
      }

      await createOrganizerEvent(auth.user.id, {
        title: title.trim(),
        description: description.trim(),
        longDesc: longDesc.trim() || description.trim(),
        category,
        format,
        date,
        time,
        location: location.trim(),
        price: isFree ? 0 : Number(price) || 0,
        capacity: capacity ? Number(capacity) : 0,
        ticketUrl: ticketUrl.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
      })

      router.push('/organizers/events')
    } catch (err) {
      console.error('createOrganizerEvent failed', err)
      setError('We could not save your event. Please check your details and try again.')
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-6">
        <Link href="/organizers/events"
          className="text-sm font-body flex items-center gap-1.5 transition-colors"
          style={{ color: 'var(--v-muted)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          My Events
        </Link>
      </div>

      <h1 className="h-lg mb-1" style={{ color: 'var(--v-text)' }}>Post Event</h1>
      <p className="font-body text-sm mb-8" style={{ color: 'var(--v-muted)' }}>
        This goes live immediately — there's no approval step.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="form-label">Event title *</label>
          <input type="text" className="form-input" value={title}
            onChange={e => setTitle(e.target.value)} placeholder="e.g. Lagos Dev Summit 2026" required />
        </div>

        <div>
          <label className="form-label">Short description *</label>
          <textarea className="form-input" rows={3} value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="One or two sentences — this is what shows on event cards."
            style={{ resize: 'vertical', minHeight: '80px' }} required />
        </div>

        <div>
          <label className="form-label">Full details (optional)</label>
          <textarea className="form-input" rows={5} value={longDesc}
            onChange={e => setLongDesc(e.target.value)}
            placeholder="Agenda, speakers, what attendees should expect — shown on the event detail page."
            style={{ resize: 'vertical', minHeight: '120px' }} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Category *</label>
            <select className="form-input" value={category}
              onChange={e => setCategory(e.target.value as Category)}>
              {CATEGORY_ORDER.map(cat => (
                <option key={cat} value={cat}>{CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Format *</label>
            <select className="form-input" value={format}
              onChange={e => setFormat(e.target.value as Format)}>
              {FORMATS.map(fmt => (
                <option key={fmt} value={fmt}>{FORMAT_META[fmt].label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Date *</label>
            <input type="date" className="form-input" value={date}
              onChange={e => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Time *</label>
            <input type="time" className="form-input" value={time}
              onChange={e => setTime(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="form-label">{format === 'online' ? 'Link / Platform *' : 'Location *'}</label>
          <input type="text" className="form-input" value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder={format === 'online' ? 'Zoom link, sent after registration' : 'Venue and city'} required />
        </div>

        <div>
          <label className="form-label">Price</label>
          <div className="flex items-center gap-3 mb-3">
            <button type="button" onClick={() => setIsFree(true)}
              className="px-4 py-2 rounded-full text-xs font-body transition-all"
              style={{
                background: isFree ? 'var(--v-gold-dim)' : 'var(--v-border)',
                border: `1px solid ${isFree ? 'var(--v-gold-border)' : 'var(--v-border-s)'}`,
                color: isFree ? 'var(--v-gold)' : 'var(--v-ghost)',
              }}>
              Free
            </button>
            <button type="button" onClick={() => setIsFree(false)}
              className="px-4 py-2 rounded-full text-xs font-body transition-all"
              style={{
                background: !isFree ? 'var(--v-gold-dim)' : 'var(--v-border)',
                border: `1px solid ${!isFree ? 'var(--v-gold-border)' : 'var(--v-border-s)'}`,
                color: !isFree ? 'var(--v-gold)' : 'var(--v-ghost)',
              }}>
              Paid
            </button>
          </div>
          {!isFree && (
            <input type="number" min="0" className="form-input" value={price}
              onChange={e => setPrice(e.target.value)} placeholder="Amount in ₦" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Capacity (optional)</label>
            <input type="number" min="0" className="form-input" value={capacity}
              onChange={e => setCapacity(e.target.value)} placeholder="e.g. 200" />
          </div>
          <div>
            <label className="form-label">Ticket link (optional)</label>
            <input type="url" className="form-input" value={ticketUrl}
              onChange={e => setTicketUrl(e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div>
          <label className="form-label">Cover image (optional)</label>
          {imageUrl ? (
            <div className="relative rounded-2xl overflow-hidden mb-3" style={{ height: '140px', border: '1px solid var(--v-border-s)' }}>
              <img src={imageUrl} alt="Cover preview" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(6,9,26,0.7)', color: 'var(--v-text)' }} aria-label="Remove image">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 rounded-2xl cursor-pointer transition-all"
              style={{ height: '140px', border: '1px dashed var(--v-border-s)', background: 'var(--v-border)' }}>
              <input type="file" accept="image/*" className="hidden"
                onChange={e => handleImageUpload(e.target.files?.[0] || null)} disabled={uploadingImage} />
              {uploadingImage ? (
                <svg className="spinner w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="var(--v-gold)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/>
                </svg>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--v-ghost)" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span className="text-xs font-body" style={{ color: 'var(--v-muted)' }}>Click to upload a cover image</span>
                </>
              )}
            </label>
          )}
          {imageError && <p className="text-xs font-body text-red-400 mt-1.5">{imageError}</p>}
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
          <button type="submit" disabled={loading} className="btn-pri px-8 py-3.5 text-sm">
            {loading
              ? <svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
              : 'Post Event'
            }
          </button>
          <Link href="/organizers/events" className="btn-ghost px-6 py-3.5 text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
