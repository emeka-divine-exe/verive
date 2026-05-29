'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getOrganizerEventById, updateOrganizerEvent } from '@/lib/supabase/organizer'
import { CATEGORY_META, FORMAT_META, type Category, type Format, type Event } from '@/lib/data'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
] as const

export default function EditOrganizerEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState('')
  const [event, setEvent] = useState<Event | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    longDesc: '',
    category: 'tech' as Category,
    format: 'in-person' as Format,
    date: '',
    time: '',
    location: '',
    price: '0',
    capacity: '',
    ticketUrl: '',
    imageUrl: '',
    status: 'draft' as 'draft' | 'pending' | 'published' | 'rejected',
    featured: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      const { data: auth } = await supabase.auth.getUser()
      if (!mounted) return
      if (!auth.user) {
        router.push('/login')
        return
      }
      setUserId(auth.user.id)

      const item = await getOrganizerEventById(params.id, auth.user.id)
      if (!mounted) return
      if (!item) {
        setLoading(false)
        return
      }

      setEvent(item)
      setForm({
        title: item.title,
        description: item.description,
        longDesc: item.longDesc,
        category: item.category,
        format: item.format,
        date: item.dateRaw || '',
        time: item.time,
        location: item.location,
        price: `${item.price === 'Free' ? 0 : item.price}`,
        capacity: `${item.capacity || 0}`,
        ticketUrl: item.ticketUrl || '',
        imageUrl: item.imageUrl || '',
        status: item.status || 'draft',
        featured: item.featured || false,
      })
      setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [params.id, router])

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((current) => ({
        ...current,
        [field]: field === 'featured' ? (e.target as HTMLInputElement).checked : e.target.value,
      } as any))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setSaving(true)
    setError('')

    try {
      await updateOrganizerEvent(params.id, userId, {
        title: form.title,
        description: form.description,
        longDesc: form.longDesc,
        category: form.category,
        format: form.format,
        date: form.date,
        time: form.time,
        location: form.location,
        price: Number(form.price || 0),
        ticketUrl: form.ticketUrl || undefined,
        imageUrl: form.imageUrl || undefined,
        status: form.status,
        featured: form.featured,
        capacity: form.capacity ? Number(form.capacity) : 0,
        filled: event?.filled || 0,
      })

      setDone(true)
    } catch (err: any) {
      setError(err?.message || 'Unable to update event.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-3xl">
        <div className="py-24 flex justify-center">
          <div className="spinner w-8 h-8" />
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="p-6 md:p-10 max-w-3xl">
        <div className="gcard rounded-2xl p-10">
          <h1 className="h-md mb-2" style={{ color: '#F0EAFF' }}>Event not found</h1>
          <p className="font-body text-sm mb-6" style={{ color: 'rgba(240,234,255,0.35)' }}>
            The event either does not exist or you do not have access to it.
          </p>
          <Link href="/organizers/events" className="btn-pri text-white font-semibold px-6 py-3 text-sm">
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="p-6 md:p-10 max-w-lg">
        <div className="gcard rounded-3xl p-12 text-center anim-border">
          <div className="text-5xl mb-5">✅</div>
          <h2 className="h-lg mb-3" style={{ color: '#F0EAFF' }}>Event updated</h2>
          <p className="font-body text-sm mb-7" style={{ color: 'rgba(240,234,255,0.4)' }}>
            Your changes have been saved to Supabase.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/organizers/events" className="btn-pri text-white font-semibold px-6 py-3 text-sm">Back to Events</Link>
            <button onClick={() => setDone(false)} className="btn-ghost px-6 py-3 text-sm">Continue Editing</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-6">
        <Link href="/organizers/events" className="text-sm font-body flex items-center gap-1.5 transition-colors" style={{ color: 'rgba(240,234,255,0.32)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Events
        </Link>
      </div>

      <h1 className="h-lg mb-2" style={{ color: '#F0EAFF' }}>Edit Event</h1>
      <p className="font-body text-sm mb-8" style={{ color: 'rgba(240,234,255,0.35)' }}>
        Update the event details, workflow state, or featured status.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="form-label">Event title *</label>
          <input type="text" className="form-input" value={form.title} onChange={set('title')} required />
        </div>

        <div>
          <label className="form-label">Short description *</label>
          <textarea className="form-input" rows={3} value={form.description} onChange={set('description')} required style={{ resize: 'vertical', minHeight: '90px' }} />
        </div>

        <div>
          <label className="form-label">Long description</label>
          <textarea className="form-input" rows={5} value={form.longDesc} onChange={set('longDesc')} style={{ resize: 'vertical', minHeight: '120px' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Category *</label>
            <select className="form-input" value={form.category} onChange={set('category')} required>
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Format *</label>
            <select className="form-input" value={form.format} onChange={set('format')} required>
              {Object.entries(FORMAT_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <input type="text" className="form-input" value={form.location} onChange={set('location')} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Price (₦)</label>
            <input type="number" className="form-input" min="0" value={form.price} onChange={set('price')} />
          </div>
          <div>
            <label className="form-label">Capacity</label>
            <input type="number" className="form-input" min="0" value={form.capacity} onChange={set('capacity')} />
          </div>
        </div>

        <div>
          <label className="form-label">Ticket / Registration URL</label>
          <input type="url" className="form-input" value={form.ticketUrl} onChange={set('ticketUrl')} />
        </div>

        <div>
          <label className="form-label">Hero image URL</label>
          <input type="url" className="form-input" value={form.imageUrl} onChange={set('imageUrl')} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Workflow state</label>
            <select className="form-input" value={form.status} onChange={set('status')}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,181,253,0.12)' }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((current) => ({ ...current, featured: e.target.checked }))} />
              <span className="font-body text-sm" style={{ color: '#F0EAFF' }}>Feature this event</span>
            </label>
          </div>
        </div>

        {error && <p className="text-xs font-body text-red-400">{error}</p>}

        <div className="pt-2 flex gap-3">
          <button type="submit" disabled={saving} className="btn-pri text-white font-semibold px-8 py-4 text-base flex-1">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link href="/organizers/events" className="btn-ghost px-6 py-4 text-base">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
