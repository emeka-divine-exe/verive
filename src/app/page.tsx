'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { getFeaturedEvents, getOrganizers } from '@/lib/supabase/queries'

export default function LandingPage() {
  const [events, setEvents] = useState<any[]>([])
  const [organizers, setOrganizers] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      const featured = await getFeaturedEvents()
      const orgs = await getOrganizers()

      setEvents(featured)
      setOrganizers(orgs)
    }

    loadData()
  }, [])

  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-screen flex items-center">
        <div className="container-page py-24">
          <div className="max-w-3xl">
            <h1
              className="h-hero mb-6"
              style={{ color: '#F0EAFF' }}
            >
              Verified tech events in Africa.
            </h1>

            <p
              className="font-body text-lg mb-10"
              style={{ color: 'rgba(240,234,255,0.42)' }}
            >
              All event content now loads directly from Supabase instead of mock data.
            </p>

            <div className="flex gap-4 mb-16">
              <Link
                href="/events"
                className="btn-pri text-white font-semibold px-8 py-4"
              >
                Browse Events
              </Link>

              <Link
                href="/organizers"
                className="btn-ghost px-8 py-4"
              >
                Organizers
              </Link>
            </div>

            <div className="mb-12">
              <h2
                className="text-2xl mb-4"
                style={{ color: '#F0EAFF' }}
              >
                Featured Events
              </h2>

              {events.length === 0 ? (
                <div style={{ color: '#F0EAFF' }}>
                  No featured events found.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {events.slice(0, 4).map((event) => (
                    <div
                      key={event.id}
                      className="gcard rounded-2xl p-5"
                    >
                      <h3
                        className="font-semibold text-lg mb-2"
                        style={{ color: '#F0EAFF' }}
                      >
                        {event.title}
                      </h3>

                      <p
                        style={{ color: 'rgba(240,234,255,0.4)' }}
                      >
                        {event.location}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2
                className="text-2xl mb-4"
                style={{ color: '#F0EAFF' }}
              >
                Verified Organizers
              </h2>

              {organizers.length === 0 ? (
                <div style={{ color: '#F0EAFF' }}>
                  No organizers found.
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {organizers.slice(0, 6).map((org) => (
                    <div
                      key={org.id}
                      className="gcard px-4 py-3 rounded-xl"
                    >
                      <span style={{ color: '#F0EAFF' }}>
                        {org.full_name || org.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
