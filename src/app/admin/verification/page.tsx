'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Status = 'pending' | 'approved' | 'rejected' | 'all'

interface VRequest {
  id:           string
  organizer_id: string
  status:       string
  message:      string | null
  admin_note:   string | null
  created_at:   string | null
  profile?:     { full_name: string | null; email: string | null }
}

interface Toast { msg: string; type: 'success' | 'error' }

export default function AdminVerificationPage() {
  const supabase  = createClient()
  const [requests, setRequests] = useState<VRequest[]>([])
  const [filter,   setFilter]   = useState<Status>('pending')
  const [notes,    setNotes]    = useState<Record<string, string>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [toast,    setToast]    = useState<Toast | null>(null)

  function showToast(msg: string, type: Toast['type'] = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    const { data, error } = await supabase
      .from('verification_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) { setLoading(false); return }

    const rows = (data || []) as VRequest[]

    // Enrich with profile data
    const ids   = [...new Set(rows.map(r => r.organizer_id))]
    const { data: profiles } = await supabase
      .from('profiles').select('id,full_name,email').in('id', ids)

    const pMap = new Map((profiles || []).map((p: any) => [p.id, p]))
    const enriched = rows.map(r => ({ ...r, profile: pMap.get(r.organizer_id) }))

    setRequests(enriched)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDecision(req: VRequest, decision: 'approved' | 'rejected') {
    const adminNote = notes[req.id] || ''
    const { error: reqErr } = await supabase
      .from('verification_requests')
      .update({ status: decision, admin_note: adminNote })
      .eq('id', req.id)

    if (reqErr) { showToast('Update failed.', 'error'); return }

    if (decision === 'approved') {
      await supabase.from('profiles').update({ verified: true }).eq('id', req.organizer_id)
    }

    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: decision } : r))
    showToast(`Application ${decision}.`)
  }

  const filtered = requests.filter(r => filter === 'all' || r.status === filter)
  const pendingCount = requests.filter(r => r.status === 'pending').length

  const tabs: { key: Status; label: string }[] = [
    { key: 'pending',  label: `Pending${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'all',      label: 'All' },
  ]

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
        <div className="sec-label sec-label-left mb-4"><span>Verification</span></div>
        <h1 className="h-lg mb-2" style={{ color: '#F0E8D6' }}>Badge applications</h1>
        <p className="font-body text-sm" style={{ color: 'rgba(240,232,214,0.38)' }}>
          Review organizer applications for the Verive verified badge.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className="text-xs font-body font-semibold px-4 py-2 rounded-xl transition-all"
            style={{
              background: filter === key ? 'rgba(194,130,13,0.14)' : 'rgba(240,232,214,0.04)',
              color:      filter === key ? '#C2820D'               : 'rgba(240,232,214,0.36)',
              border:     `1px solid ${filter === key ? 'rgba(194,130,13,0.28)' : 'rgba(240,232,214,0.07)'}`,
            }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="gcard rounded-2xl p-10 flex justify-center">
          <div className="spinner w-7 h-7 rounded-full border-2"
            style={{ borderColor: 'rgba(194,130,13,0.2)', borderTopColor: '#C2820D' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="gcard rounded-2xl p-10 text-center">
          <p className="font-body text-sm" style={{ color: 'rgba(240,232,214,0.32)' }}>
            No {filter !== 'all' ? filter : ''} applications.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => {
            const isOpen = expanded === req.id
            const statusColor = req.status === 'approved' ? '#27967F' : req.status === 'rejected' ? '#FCA5A5' : '#C2820D'
            const statusBg    = req.status === 'approved' ? 'rgba(31,122,104,0.14)' : req.status === 'rejected' ? 'rgba(239,68,68,0.12)' : 'rgba(194,130,13,0.12)'

            return (
              <div key={req.id} className="gcard rounded-2xl overflow-hidden">
                {/* Summary row */}
                <button className="w-full flex items-center gap-4 p-5 text-left"
                  onClick={() => setExpanded(isOpen ? null : req.id)}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                    style={{ background: 'rgba(194,130,13,0.16)', color: '#D4970F' }}>
                    {(req.profile?.full_name || req.profile?.email || 'O').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-display font-semibold text-sm" style={{ color: '#F0E8D6' }}>
                      {req.profile?.full_name || 'Unknown Organizer'}
                    </p>
                    <p className="font-body text-xs" style={{ color: 'rgba(240,232,214,0.32)' }}>
                      {req.profile?.email} · {req.created_at ? new Date(req.created_at).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <span className="text-xs font-body font-semibold px-3 py-1 rounded-lg flex-shrink-0"
                    style={{ background: statusBg, color: statusColor }}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'rgba(240,232,214,0.28)' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* Expanded */}
                {isOpen && (
                  <div className="px-5 pb-5" style={{ borderTop: '1px solid rgba(240,232,214,0.06)' }}>
                    {req.message && (
                      <div className="mt-4 mb-4 p-4 rounded-xl" style={{ background: 'rgba(240,232,214,0.04)' }}>
                        <p className="font-body text-xs mb-2" style={{ color: 'rgba(240,232,214,0.40)' }}>
                          Application message:
                        </p>
                        <p className="font-body text-sm leading-relaxed" style={{ color: '#F0E8D6' }}>
                          {req.message}
                        </p>
                      </div>
                    )}

                    {req.status === 'pending' && (
                      <>
                        <div className="mb-4">
                          <label className="form-label">Admin note (shown to organizer)</label>
                          <textarea
                            rows={3}
                            className="form-input resize-none"
                            placeholder="Optional note…"
                            value={notes[req.id] || ''}
                            onChange={e => setNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                          />
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => handleDecision(req, 'approved')}
                            className="btn-teal text-xs px-5 py-2.5 rounded-xl">
                            ✓ Approve
                          </button>
                          <button onClick={() => handleDecision(req, 'rejected')}
                            className="text-xs font-body font-semibold px-5 py-2.5 rounded-xl transition-all"
                            style={{ background: 'rgba(239,68,68,0.12)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.20)' }}>
                            ✕ Decline
                          </button>
                        </div>
                      </>
                    )}

                    {req.admin_note && req.status !== 'pending' && (
                      <p className="font-body text-sm mt-3" style={{ color: 'rgba(240,232,214,0.40)' }}>
                        <strong style={{ color: 'rgba(240,232,214,0.55)' }}>Admin note:</strong> {req.admin_note}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
