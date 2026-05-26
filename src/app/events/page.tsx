'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EventCard } from '@/components/EventCard'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { Footer } from '@/components/Footer'
import { getEvents } from '@/lib/supabase/queries'
import type { Category, Format } from '@/lib/supabase/queries'

gsap.registerPlugin(ScrollTrigger)

const FORMATS: { key: Format; label: string }[] = [
  { key: 'in-person', label: 'In-Person' },
  { key: 'online',    label: 'Online' },
  { key: 'hybrid',    label: 'Hybrid' },
]

function FeedContent() {
  const searchParams = useSearchParams()
  const initCat = searchParams.get('category') as Category | null

  const [search,       setSearch]       = useState('')
  const [activeCats,   setActiveCats]   = useState<Category[]>(initCat ? [initCat] : [])
  const [activeFormat, setActiveFormat] = useState<Format | null>(null)
  const [freeOnly,     setFreeOnly]     = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [activeDate,   setActiveDate]   = useState('All Dates')

  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>('.sr')
    els.forEach(el => {
      gsap.from(el, { opacity: 0, y: 22, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  const toggleCat = (cat: Category) =>
    setActiveCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])

  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    getEvents().then(setEvents)
  }, [])

  const filtered = useMemo(() => events.filter((ev: any) => {
    if (search && !ev.title.toLowerCase().includes(search.toLowerCase()) &&
        !ev.organizer.toLowerCase().includes(search.toLowerCase())) return false
    if (activeCats.length > 0 && !activeCats.includes(ev.category)) return false
    if (activeFormat && ev.format !== activeFormat) return false
    if (freeOnly && ev.price !== 'Free' && ev.price !== 0) return false
    return true
  }), [search, activeCats, activeFormat, freeOnly])

  const hasFilters = activeCats.length > 0 || activeFormat || freeOnly || verifiedOnly || search

  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="page-header">
        <div className="orb w-96 h-96 right-0 top-0 translate-x-1/3 -translate-y-1/4" style={{ background: 'rgba(123,63,228,0.16)' }} />
        <div className="container-page relative z-10">
          <div className="sec-label sec-label-left sr"><span>Discovery</span></div>
          <h1 className="sr h-xl mb-4" style={{ color: '#F0EAFF' }}>
            Find your next<br /><span className="gradient-text">opportunity.</span>
          </h1>
          <p className="sr font-body text-base max-w-lg" style={{ color: 'rgba(240,234,255,0.38)', fontSize: '1rem' }}>
            Curated, verified events across tech, design, and startup ecosystems. Updated regularly.
          </p>
        </div>
      </div>

      <div className="container-page py-10 pb-24">

        {/* Mobile controls */}
        <div className="lg:hidden mb-5 flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: 'rgba(240,234,255,0.22)' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input className="search-input" type="text" placeholder="Search events…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setSidebarOpen(o => !o)} className="btn-ghost px-4 py-2 text-sm flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
            Filters
          </button>
        </div>

        {/* Mobile category chips */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-5" style={{ scrollbarWidth: 'none' }}>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button key={key} onClick={() => toggleCat(key as Category)}
              className={`chip flex-shrink-0 ${activeCats.includes(key as Category) ? 'active' : ''}`}>
              {meta.emoji} {meta.label}
            </button>
          ))}
          <button onClick={() => setFreeOnly(f => !f)} className={`chip flex-shrink-0 ${freeOnly ? 'active' : ''}`}>Free Only</button>
        </div>

        <div className="flex gap-8">

          {/* Sidebar */}
          <aside className={`
            lg:w-60 flex-shrink-0 lg:block
            ${sidebarOpen
              ? 'block fixed inset-0 z-40 overflow-y-auto p-6 pt-24'
              : 'hidden'}
          `} style={{ background: sidebarOpen ? 'rgba(13,7,25,0.97)' : 'transparent', backdropFilter: sidebarOpen ? 'blur(20px)' : 'none' }}>

            {/* Mobile close */}
            {sidebarOpen && (
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-20 right-6" style={{ color: 'rgba(240,234,255,0.4)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            )}

            {/* Desktop search */}
            <div className="hidden lg:block relative mb-6">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: 'rgba(240,234,255,0.22)' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input className="search-input" type="text" placeholder="Search events, organizers…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Category */}
            <div className="mb-6">
              <div className="filter-label">Category</div>
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <button key={key} onClick={() => toggleCat(key as Category)}
                  className={`filter-opt ${activeCats.includes(key as Category) ? 'active' : ''}`}>
                  <div className="dot" />
                  <span>{meta.emoji}</span><span>{meta.label}</span>
                </button>
              ))}
            </div>

            {/* Date */}
            <div className="mb-6">
              <div className="filter-label">Date</div>
              {['All Dates','This Week','This Month','Next Month'].map(d => (
                <button key={d} onClick={() => setActiveDate(d)}
                  className={`filter-opt ${activeDate === d ? 'active' : ''}`}>
                  <div className="dot" />{d}
                </button>
              ))}
            </div>

            {/* Format */}
            <div className="mb-6">
              <div className="filter-label">Format</div>
              {FORMATS.map(({ key, label }) => (
                <button key={key} onClick={() => setActiveFormat(f => f === key ? null : key)}
                  className={`filter-opt ${activeFormat === key ? 'active' : ''}`}>
                  <div className="dot" />{label}
                </button>
              ))}
            </div>

            {/* Toggles */}
            <div className="mb-6">
              <div className="filter-label">Options</div>
              <div className="flex items-center justify-between px-3 mb-3">
                <span className="text-sm font-body" style={{ color: 'rgba(240,234,255,0.42)' }}>Free events only</span>
                <div className={`toggle-track ${freeOnly ? 'on' : ''}`} onClick={() => setFreeOnly(f => !f)}>
                  <div className="toggle-thumb" />
                </div>
              </div>
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-body" style={{ color: 'rgba(240,234,255,0.42)' }}>Verified only</span>
                  <VerifiedBadge size={13} />
                </div>
                <div className={`toggle-track ${verifiedOnly ? 'on' : ''}`} onClick={() => setVerifiedOnly(f => !f)}>
                  <div className="toggle-thumb" />
                </div>
              </div>
            </div>

            {/* Clear */}
            {hasFilters && (
              <button onClick={() => { setActiveCats([]); setActiveFormat(null); setFreeOnly(false); setVerifiedOnly(false); setSearch(''); setActiveDate('All Dates') }}
                className="text-xs font-body flex items-center gap-1.5 px-3 transition-colors"
                style={{ color: 'rgba(240,234,255,0.26)' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                Clear all filters
              </button>
            )}
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">

            {/* Results row */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-body" style={{ color: 'rgba(240,234,255,0.32)' }}>
                <span className="font-semibold" style={{ color: 'rgba(240,234,255,0.65)' }}>{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''} found
              </p>
              <select className="text-xs font-body outline-none cursor-pointer px-3 py-2 rounded-lg"
                style={{ background: '#1A1032', border: '1px solid rgba(196,181,253,0.08)', color: 'rgba(240,234,255,0.42)' }}>
                <option>Soonest first</option>
                <option>Free first</option>
                <option>Most popular</option>
              </select>
            </div>

            {/* Active filter pills */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {activeCats.map(cat => (
                  <button key={cat} onClick={() => toggleCat(cat)}
                    className="flex items-center gap-1.5 text-xs font-body px-3 py-1 rounded-full"
                    style={{ background: 'rgba(123,63,228,0.16)', border: '1px solid rgba(196,181,253,0.2)', color: '#C4B5FD' }}>
                    {CATEGORY_META[cat].label}
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                ))}
                {freeOnly && (
                  <button onClick={() => setFreeOnly(false)}
                    className="flex items-center gap-1.5 text-xs font-body px-3 py-1 rounded-full"
                    style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}>
                    Free only
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                )}
              </div>
            )}

            {filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(ev => (
                  <div key={ev.id} className="sr"><EventCard event={ev} /></div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <div className="text-5xl mb-5">🔍</div>
                <h3 className="h-md mb-2" style={{ color: '#F0EAFF' }}>No events found</h3>
                <p className="font-body text-sm mb-6" style={{ color: 'rgba(240,234,255,0.32)' }}>Try adjusting your filters or search terms.</p>
                <button onClick={() => { setActiveCats([]); setActiveFormat(null); setFreeOnly(false); setSearch('') }}
                  className="btn-ghost px-6 py-3 text-sm">Clear filters</button>
              </div>
            )}

            {filtered.length > 0 && (
              <div className="mt-12 text-center">
                <button className="btn-ghost px-8 py-3.5 text-sm">Load more events</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function EventsFeedPage() {
  return (
    <Suspense>
      <FeedContent />
    </Suspense>
  )
}
