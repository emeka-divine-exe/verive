'use client'

import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

export default function EditEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)

      console.log(formData)

      alert('Event updated successfully.')
    } catch (error) {
      console.error(error)
      alert('Failed to update event.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">
        Edit Event
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border p-6"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            Event Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Location
          </label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-6 py-3 text-white"
        >
          {loading ? 'Updating...' : 'Update Event'}
        </button>
      </form>
    </div>
  )
}
