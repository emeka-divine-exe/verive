'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface EventRow {
  id:          string
  title:       string | null
  category:    string | null
  format:      string | null
  date:        string | null
  featured:    boolean | null
  organizer_id:string | null
  created_at:  string | null
  orgName?:    string
}

interface Toast { msg: string; type: 'success' | 'error' }

export default function AdminEventsPage() {
  const supabase = createClient()
  const [events,  setEvents]  = useState<EventRow[]>([])
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)
  const [toast,   setToast]   = useState<Toast | null>(null)

  function showToast(msg: string, type: Toast['type'] = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    const { data: evData } = await supabase
      .from('events').select('*').order('created_at', { ascending: false })

    const rows = (evData || []) as EventRow[]
    const ids = Array.from(new Set(rows.map(r => r.organizer_id).filter(Boolean))) as string[]
    const { data: profiles } = await supabase
      .from('profiles').select('id,full_name').in('id', ids)

    const pMap = new Map((profiles || []).map((p: any) => [p.id, p.full_name || p.id]))
    const enriched = rows.map(r => ({ ...r, orgName: pMap.get(r.organizer_id || '') || 'Unknown' }))

    setEvents(enriched)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleFeatured(ev: EventRow) {
    const newVal = !ev.featured
    const { error } = await supabase.from('events').update({ featured: newVal }).eq('id', ev.id)
    if (error) { showToast('Update failed.', 'error'); return }
    setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, featured: newVal } : e))
    showToast(`${ev.title} ${newVal ? 'featured' : 'unfeatured'}.`)
  }

  async function deleteEvent(ev: EventRow) {
    if (!confirm(`Delete "${ev.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('events').delete().eq('id', ev.id)
    if (error) { showToast('Delete failed.', 'error'); return }
    setEvents(prev => prev.filter(e => e.id !== ev.id))
    showToast(`${ev.title} deleted.`)
  }

  const filtered = events.filter(e =>
    !search || `${e.title} ${e.orgName} ${e.category}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl font-body text-sm font-semibold shadow-xl"
          style={{ background: toast.type === 'success' ? '#1F7A68' : '#EF4444', color: '#F0E8D6' }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <div className="sec-label sec-label-left mb-4"><span>Event Management</span></div>
        <h1 className="h-lg mb-2" style={{ color: '#F0E8D6' }}>Events</h1>
        <p className="font-body text-sm" style={{ color: 'rgba(240,232,214,0.38)' }}>
          Feature events for homepage visibility or remove events that violate platform standards.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
          style={{ color: 'rgba(240,232,214,0.22)' }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input className="search-input" type="text" placeholder="Search by title, organizer, or category…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="gcard rounded-2xl p-10 flex justify-center">
          <div className="spinner w-7 h-7 rounded-full border-2"
            style={{ borderColor: 'rgba(194,130,13,0.2)', borderTopColor: '#C2820D' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="gcard rounded-2xl p-10 text-center">
          <p className="font-body text-sm" style={{ color: 'rgba(240,232,214,0.32)' }}>No events found.</p>
        </div>
      ) : (
        <div className="gcard rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead style={{ borderBottom: '1px solid rgba(240,232,214,0.07)' }}>
              <tr>
                {['Event', 'Organizer', 'Category', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left p-4 font-body text-xs font-semibold"
                    style={{ color: 'rgba(240,232,214,0.32)', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ev => (
                <tr key={ev.id} style={{ borderBottom: '1px solid rgba(240,232,214,0.05)' }}>
                  <td className="p-4">
                    <p className="font-body text-sm truncate max-w-[180px]" style={{ color: '#F0E8D6' }}>{ev.title || '—'}</p>
                    {ev.featured && (
                      <span className="text-[0.6rem] font-body font-bold uppercase"
                        style={{ color: '#C2820D' }}>Featured</span>
                    )}
                  </td>
                  <td className="p-4 font-body text-sm" style={{ color: 'rgba(240,232,214,0.44)' }}>
                    {ev.orgName}
                  </td>
                  <td className="p-4">
                    <span className={`tag tag-${ev.category || 'tech'}`}>{ev.category || '—'}</span>
                  </td>
                  <td className="p-4 font-body text-xs" style={{ color: 'rgba(240,232,214,0.36)' }}>
                    {ev.date ? new Date(ev.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: '2-digit' }) : 'TBA'}
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-body px-2.5 py-1 rounded-lg"
                      style={{ background: 'rgba(31,122,104,0.14)', color: '#27967F' }}>
                      Live
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleFeatured(ev)}
                        className="text-xs font-body font-semibold px-3 py-1.5 rounded-lg transition-all"
                        style={{
                          background: ev.featured ? 'rgba(194,130,13,0.18)' : 'rgba(240,232,214,0.06)',
                          color:      ev.featured ? '#C2820D'               : 'rgba(240,232,214,0.40)',
                        }}>
                        {ev.featured ? '★ Unfeature' : '☆ Feature'}
                      </button>
                      <button onClick={() => deleteEvent(ev)}
                        className="text-xs font-body font-semibold px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: 'rgba(239,68,68,0.10)', color: '#FCA5A5' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
