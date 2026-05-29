'use client'

import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

export default function OrganizerApplyPage() {
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    website: '',
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

      alert('Application submitted successfully.')
    } catch (error) {
      console.error(error)
      alert('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">
        Organizer Application
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border p-6"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            Organization Name
          </label>

          <input
            type="text"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Website
          </label>

          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3"
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
            rows={5}
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-6 py-3 text-white"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  )
}
