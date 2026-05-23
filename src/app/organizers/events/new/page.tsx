'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = ['Tech','Design','Startup','Career','Community']
const FORMATS    = ['In-Person','Online','Hybrid']

export default function PostEventPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    title: '', description: '', category: '', format: '',
    date: '', time: '', location: '', price: '', ticketUrl: '',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [done,    setDone]    = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('You must be logged in.'); setLoading(false); return }

    const { error } = await supabase.from('events').insert({
      title:       form.title,
      description: form.description,
      category:    form.category.toLowerCase(),
      format:      form.format.toLowerCase().replace('-', ''),
      date:        form.date,
      time:        form.time,
      location:    form.location,
      price:       form.price === '0' || form.price === '' ? 0 : Number(form.price),
      ticket_url:  form.ticketUrl,
      organizer_id: user.id,
      status:      'pending',   // admin reviews before publishing
    })

    if (error) { setError(error.message); setLoading(false); return }
    setDone(true); setLoading(false)
  }

  if (done) return (
    <div className="p-6 md:p-10 max-w-lg">
      <div className="gcard rounded-3xl p-12 text-center anim-border">
        <div className="text-5xl mb-5">🎉</div>
        <h2 className="h-lg mb-3" style={{ color: '#F0EAFF' }}>Event submitted!</h2>
        <p className="font-body text-sm mb-7" style={{ color: 'rgba(240,234,255,0.4)' }}>
          Your event has been submitted for review. We&apos;ll publish it once our team has approved it.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/organizer/events" className="btn-pri text-white font-semibold px-6 py-3 text-sm">My Events</Link>
          <button onClick={() => setDone(false)} className="btn-ghost px-6 py-3 text-sm">Post Another</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/organizer/dashboard" className="text-sm font-body flex items-center gap-1.5 transition-colors"
          style={{ color: 'rgba(240,234,255,0.32)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Dashboard
        </Link>
      </div>

      <h1 className="h-lg mb-1" style={{ color: '#F0EAFF' }}>Post New Event</h1>
      <p className="font-body text-sm mb-8" style={{ color: 'rgba(240,234,255,0.35)' }}>
        Fill in the details below. Your event will be reviewed before publishing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="form-label">Event title *</label>
          <input type="text" className="form-input" placeholder="e.g. Lagos Developer Summit 2025"
            value={form.title} onChange={set('title')} required />
        </div>

        <div>
          <label className="form-label">Description *</label>
          <textarea className="form-input" rows={5} placeholder="Tell people what this event is about…"
            value={form.description} onChange={set('description')} required
            style={{ resize: 'vertical', minHeight: '120px' }} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Category *</label>
            <select className="form-input" value={form.category} onChange={set('category')} required>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Format *</label>
            <select className="form-input" value={form.format} onChange={set('format')} required>
              <option value="">Select format</option>
              {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Date *</label>
            <input type="date" className="form-input" value={form.date} onChange={set('date')} required />
          </div>
          <div>
            <label className="form-label">Time *</label>
            <input type="time" className="form-input" value={form.time} onChange={set('time')} required />
          </div>
        </div>

        <div>
          <label className="form-label">Location / Platform *</label>
          <input type="text" className="form-input"
            placeholder="e.g. Landmark Centre, VI or Online · Zoom"
            value={form.location} onChange={set('location')} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Price (₦) — enter 0 for free</label>
            <input type="number" className="form-input" placeholder="0" min="0"
              value={form.price} onChange={set('price')} />
          </div>
          <div>
            <label className="form-label">Ticket / Registration URL</label>
            <input type="url" className="form-input" placeholder="https://eventbrite.com/…"
              value={form.ticketUrl} onChange={set('ticketUrl')} />
          </div>
        </div>

        {error && (
          <p className="text-xs font-body text-red-400 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </p>
        )}

        <div className="pt-2 flex gap-3">
          <button type="submit" disabled={loading} className="btn-pri text-white font-semibold px-8 py-4 text-base flex-1">
            {loading
              ? <svg className="spinner w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
              : 'Submit for Review'
            }
          </button>
          <Link href="/organizer/dashboard" className="btn-ghost px-6 py-4 text-base">Cancel</Link>
        </div>

        <p className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.22)' }}>
          Your event will be reviewed by our team before going live. Verified organizers get faster review times.
        </p>
      </form>
    </div>
  )
}
