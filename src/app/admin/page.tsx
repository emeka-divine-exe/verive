'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleEventSubmit(formData: FormData) {
    setLoading(true)
    setMessage('')

    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      location: formData.get('location'),
      starts_at: formData.get('starts_at'),
      price: Number(formData.get('price') || 0),
      published: true,
      featured: false,
    }

    const { error } = await supabase.from('events').insert(payload)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Event created successfully.')
    }

    setLoading(false)
  }

  async function handleOrganizerSubmit(formData: FormData) {
    setLoading(true)
    setMessage('')

    const payload = {
      full_name: formData.get('full_name'),
      username: formData.get('username'),
      role: 'organizer',
      bio: formData.get('bio'),
    }

    const { error } = await supabase.from('profiles').insert(payload)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Organizer created successfully.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen container-page py-20">
      <div className="mb-12">
        <div className="sec-label sec-label-left mb-6">
          <span>Admin Dashboard</span>
        </div>

        <h1 className="h-xl mb-4" style={{ color: '#F0EAFF' }}>
          Manage platform content.
        </h1>

        <p className="font-body max-w-2xl" style={{ color: 'rgba(240,234,255,0.38)' }}>
          Create events, onboard organizers, and manage platform activity directly from Supabase.
        </p>
      </div>

      {message && (
        <div className="gcard rounded-2xl p-4 mb-8" style={{ color: '#F0EAFF' }}>
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <form action={handleEventSubmit} className="gcard rounded-3xl p-8 space-y-5">
          <div>
            <h2 className="h-md mb-2" style={{ color: '#F0EAFF' }}>
              Create Event
            </h2>
            <p className="text-sm" style={{ color: 'rgba(240,234,255,0.36)' }}>
              Add new events directly into the Supabase database.
            </p>
          </div>

          <input name="title" required placeholder="Event title" className="w-full rounded-xl bg-black/20 border border-white/10 p-4 text-white" />
          <textarea name="description" required placeholder="Event description" className="w-full rounded-xl bg-black/20 border border-white/10 p-4 text-white min-h-[120px]" />
          <input name="location" required placeholder="Location" className="w-full rounded-xl bg-black/20 border border-white/10 p-4 text-white" />

          <select name="category" className="w-full rounded-xl bg-black/20 border border-white/10 p-4 text-white">
            <option value="tech">Tech</option>
            <option value="design">Design</option>
            <option value="startup">Startup</option>
            <option value="career">Career</option>
            <option value="community">Community</option>
          </select>

          <input type="datetime-local" name="starts_at" required className="w-full rounded-xl bg-black/20 border border-white/10 p-4 text-white" />
          <input type="number" name="price" placeholder="Price" className="w-full rounded-xl bg-black/20 border border-white/10 p-4 text-white" />

          <button disabled={loading} className="btn-pri text-white font-semibold px-6 py-4 w-full">
            {loading ? 'Saving...' : 'Publish Event'}
          </button>
        </form>

        <form action={handleOrganizerSubmit} className="gcard rounded-3xl p-8 space-y-5">
          <div>
            <h2 className="h-md mb-2" style={{ color: '#F0EAFF' }}>
              Add Organizer
            </h2>
            <p className="text-sm" style={{ color: 'rgba(240,234,255,0.36)' }}>
              Register verified organizers and companies on the platform.
            </p>
          </div>

          <input name="full_name" required placeholder="Organizer name" className="w-full rounded-xl bg-black/20 border border-white/10 p-4 text-white" />
          <input name="username" required placeholder="Username" className="w-full rounded-xl bg-black/20 border border-white/10 p-4 text-white" />
          <textarea name="bio" required placeholder="Short bio" className="w-full rounded-xl bg-black/20 border border-white/10 p-4 text-white min-h-[140px]" />

          <button disabled={loading} className="btn-pri text-white font-semibold px-6 py-4 w-full">
            {loading ? 'Saving...' : 'Create Organizer'}
          </button>
        </form>
      </div>
    </div>
  )
}
