'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { EventCard } from '@/components/EventCard'
import { Footer } from '@/components/Footer'
import { CATEGORY_META, CATEGORY_ORDER, FORMAT_META, type Category, type Event, type Format } from '@/lib/data'
import { getEvents } from '@/lib/supabase/queries'

gsap.registerPlugin(ScrollTrigger)

const FORMATS: { key: Format; label: string }[] = [
  { key: 'in-person', label: 'In-Person' },
  { key: 'online',    label: 'Online'    },
  { key: 'hybrid',    label: 'Hybrid'    },
]

function FeedContent() {
  const searchParams    = useSearchParams()
  const initialCategory = searchParams.get('category') as Category | null

  const [search,      setSearch]      = useState('')
  const [activeCats,  setActiveCats]  = useState<Category[]>(initialCategory ? [initialCategory] : [])
  const [activeFormat,setActiveFormat]= useState<Format | null>(null)
  const [freeOnly,    setFreeOnly]    = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [events,      setEvents]      = useState<Event[]>([])
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await getEvents()
        if (!mounted) return
        setEvents(data)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>('.sr')
    els.forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 22, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      })
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  const toggleCat = (cat: Category) =>
    setActiveCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])

  const filtered = useMemo(() => events.filter(event => {
    if (search && !`${event.title} ${event.organizer}`.toLowerCase().includes(search.toLowerCase())) return false
    if (activeCats.length > 0 && !activeCats.includes(event.category)) return false
    if (activeFormat && event.format !== activeFormat) return false
    if (freeOnly && !(event.price === 0 || event.price === 'Free')) return false
    return true
  }), [events, search, activeCats, activeFormat, freeOnly])

  const hasFilters = activeCats.length > 0 || activeFormat || freeOnly || search.length > 0

  return (
    <div className="min-h-screen">

      {/* Page header */}
      <div className="page-header">
        <div className="orb w-96 h-96 right-0 top-0 translate-x-1/3 -translate-y-1/4"
          style={{ background: 'rgba(194,130,13,0.09)' }} />
        <div className="container-page relative z-10">
          <div className="sec-label sec-label-left sr"><span>Discovery</span></div>
          <h1 className="sr h-xl mb-4" style={{ color: '#F0E8D6' }}>
            Find your next<br />
            <span className="gradient-text">opportunity.</span>
          </h1>
          <p className="sr font-body text-base max-w-lg" style={{ color: 'rgba(240,232,214,0.40)' }}>
            Verified events from trusted organizers across Lagos. Ranked by community trust, not paid placement.
          </p>
        </div>
      </div>

      <div className="container-page py-10 pb-24">

        {/* Mobile search + filter toggle */}
        <div className="lg:hidden mb-5 flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
              style={{ color: 'rgba(240,232,214,0.22)' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input className="search-input" type="text" placeholder="Search events…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setSidebarOpen(o => !o)}
            className="btn-ghost px-4 py-2 text-sm flex-shrink-0">
            Filter
          </button>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          {/* Sidebar filters */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="gcard rounded-2xl p-5 sticky top-24 space-y-6">

              <div>
                <label className="form-label">Search</label>
                <input className="form-input" type="text"
                  placeholder="Search by title or organizer"
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>

              <div>
                <div className="form-label mb-3">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_ORDER.map(cat => (
                    <button key={cat} type="button" onClick={() => toggleCat(cat)}
                      className={`tag ${CATEGORY_META[cat].tagClass} ${activeCats.includes(cat) ? 'ring-1 ring-[#C2820D]' : ''}`}>
                      {CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="form-label mb-3">Format</div>
                <div className="space-y-2">
                  {FORMATS.map(format => (
                    <button key={format.key} type="button"
                      onClick={() => setActiveFormat(cur => cur === format.key ? null : format.key)}
                      className="w-full text-left px-4 py-3 rounded-2xl text-sm font-body transition-all"
                      style={{
                        background: activeFormat === format.key ? 'rgba(194,130,13,0.12)' : 'rgba(255,255,255,0.03)',
                        color:      activeFormat === format.key ? '#F0E8D6' : 'rgba(240,232,214,0.38)',
                        border:     '1px solid rgba(240,232,214,0.08)',
                      }}>
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(240,232,214,0.08)' }}>
                <input type="checkbox" checked={freeOnly} onChange={e => setFreeOnly(e.target.checked)} />
                <span className="text-sm font-body" style={{ color: '#F0E8D6' }}>Free events only</span>
              </label>
            </div>
          </aside>

          {/* Results */}
          <main>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-body" style={{ color: 'rgba(240,232,214,0.34)' }}>
                {filtered.length} result{filtered.length === 1 ? '' : 's'}
                {hasFilters ? ' · filtered' : ''}
              </p>
              <button
                onClick={() => { setSearch(''); setActiveCats([]); setActiveFormat(null); setFreeOnly(false) }}
                className="text-xs font-body transition-colors"
                style={{ color: '#C2820D' }}>
                Reset filters
              </button>
            </div>

            {loading ? (
              <div className="gcard rounded-2xl p-10 flex justify-center">
                <div className="spinner w-8 h-8 rounded-full border-2"
                  style={{ borderColor: 'rgba(194,130,13,0.2)', borderTopColor: '#C2820D' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="gcard rounded-2xl p-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-display font-semibold mb-2"
                  style={{ color: '#F0E8D6', letterSpacing: '-0.01em' }}>
                  No matching events
                </h3>
                <p className="font-body text-sm" style={{ color: 'rgba(240,232,214,0.36)' }}>
                  Try adjusting your filters or check back soon.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <FeedContent />
    </Suspense>
  )
}
