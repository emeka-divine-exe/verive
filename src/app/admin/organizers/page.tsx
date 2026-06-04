'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { VerifiedBadge } from '@/components/VerifiedBadge'

interface OrgRow {
  id:         string
  full_name:  string | null
  email:      string | null
  verified:   boolean | null
  created_at: string | null
  bio:        string | null
}

interface MetricRow {
  organizer_id:   string
  total_reviews:  number | null
  average_rating: number | null
  trust_score:    number | null
}

interface Toast { msg: string; type: 'success' | 'error' }

export default function AdminOrganizersPage() {
  const supabase = createClient()
  const [orgs,    setOrgs]    = useState<OrgRow[]>([])
  const [metrics, setMetrics] = useState<Map<string, MetricRow>>(new Map())
  const [counts,  setCounts]  = useState<Map<string, number>>(new Map())
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)
  const [toast,   setToast]   = useState<Toast | null>(null)

  function showToast(msg: string, type: Toast['type'] = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    const [{ data: orgData }, { data: metricData }, { data: eventData }] = await Promise.all([
      supabase.from('profiles').select('*').in('role', ['organizer', 'admin']).order('created_at', { ascending: false }),
      supabase.from('organizer_metrics').select('*'),
      supabase.from('events').select('organizer_id'),
    ])
    setOrgs((orgData || []) as OrgRow[])
    const mMap = new Map<string, MetricRow>()
    for (const m of (metricData || [])) mMap.set(m.organizer_id, m as MetricRow)
    setMetrics(mMap)
    const cMap = new Map<string, number>()
    for (const e of (eventData || [])) {
      const id = (e as any).organizer_id
      if (id) cMap.set(id, (cMap.get(id) || 0) + 1)
    }
    setCounts(cMap)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleVerified(org: OrgRow) {
    const newVal = !org.verified
    const { error } = await supabase.from('profiles').update({ verified: newVal }).eq('id', org.id)
    if (error) { showToast('Failed to update badge.', 'error'); return }
    setOrgs(prev => prev.map(o => o.id === org.id ? { ...o, verified: newVal } : o))
    showToast(`Badge ${newVal ? 'granted' : 'revoked'} for ${org.full_name || org.email}.`)
  }

  const filtered = orgs.filter(o =>
    !search || `${o.full_name} ${o.email}`.toLowerCase().includes(search.toLowerCase())
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
        <div className="sec-label sec-label-left mb-4"><span>Organizer Management</span></div>
        <h1 className="h-lg mb-2" style={{ color: '#F0E8D6' }}>Organizer directory</h1>
        <p className="font-body text-sm" style={{ color: 'rgba(240,232,214,0.38)' }}>
          Grant or revoke verified badges. Monitor organizer reputation in real time.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
          style={{ color: 'rgba(240,232,214,0.22)' }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input className="search-input" type="text" placeholder="Search by name or email…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="gcard rounded-2xl p-10 flex justify-center">
          <div className="spinner w-7 h-7 rounded-full border-2"
            style={{ borderColor: 'rgba(194,130,13,0.2)', borderTopColor: '#C2820D' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="gcard rounded-2xl p-10 text-center">
          <p className="font-body text-sm" style={{ color: 'rgba(240,232,214,0.32)' }}>No organizers found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(org => {
            const m = metrics.get(org.id)
            const eventCount = counts.get(org.id) || 0
            const rating = m?.average_rating || 0
            const qualifies = eventCount >= 20 && rating >= 4.5

            return (
              <div key={org.id} className="gcard rounded-2xl p-5">
                <div className="flex items-start gap-4">

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                    style={{ background: 'rgba(194,130,13,0.16)', color: '#D4970F' }}>
                    {(org.full_name || org.email || 'O').charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-display font-semibold text-sm" style={{ color: '#F0E8D6' }}>
                        {org.full_name || 'Unnamed'}
                      </span>
                      {org.verified && <VerifiedBadge size={13} />}
                      {qualifies && !org.verified && (
                        <span className="text-[0.6rem] font-body font-bold uppercase px-2 py-0.5 rounded-lg"
                          style={{ background: 'rgba(194,130,13,0.14)', color: '#C2820D' }}>
                          Auto-qualifies
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs mb-3" style={{ color: 'rgba(240,232,214,0.32)' }}>
                      {org.email}
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="font-body text-xs" style={{ color: 'rgba(240,232,214,0.40)' }}>
                        {eventCount} events
                      </span>
                      {rating > 0 && (
                        <span className="font-body text-xs" style={{ color: 'rgba(240,232,214,0.40)' }}>
                          {rating.toFixed(1)}★ avg
                        </span>
                      )}
                      {m?.total_reviews && (
                        <span className="font-body text-xs" style={{ color: 'rgba(240,232,214,0.40)' }}>
                          {m.total_reviews} reviews
                        </span>
                      )}
                    </div>

                    {/* Badge progress */}
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      {[
                        { label: '5+ events',   met: eventCount >= 5   },
                        { label: '20+ events',  met: eventCount >= 20  },
                        { label: '4.0+ rating', met: rating >= 4.0     },
                        { label: '4.5+ rating', met: rating >= 4.5     },
                      ].map(({ label, met }) => (
                        <span key={label} className="text-[0.62rem] font-body flex items-center gap-1"
                          style={{ color: met ? '#27967F' : 'rgba(240,232,214,0.22)' }}>
                          {met ? '✓' : '○'} {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <button onClick={() => toggleVerified(org)}
                    className="flex-shrink-0 text-xs font-body font-semibold px-4 py-2 rounded-xl transition-all"
                    style={{
                      background: org.verified ? 'rgba(239,68,68,0.12)' : 'rgba(194,130,13,0.14)',
                      color:      org.verified ? '#FCA5A5'               : '#C2820D',
                      border:     `1px solid ${org.verified ? 'rgba(239,68,68,0.22)' : 'rgba(194,130,13,0.28)'}`,
                    }}>
                    {org.verified ? 'Revoke Badge' : 'Grant Badge'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
