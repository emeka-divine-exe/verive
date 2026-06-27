'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UserRow {
  id:           string
  full_name:    string | null
  email:        string | null
  role:         string | null
  is_organizer: boolean | null
  verified:     boolean | null
  created_at:   string | null
  banned?:      boolean
}

interface Toast { msg: string; type: 'success' | 'error' }

export default function AdminUsersPage() {
  const supabase = createClient()
  const [users,   setUsers]   = useState<UserRow[]>([])
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState<'all' | 'attendee' | 'organizer'>('all')
  const [loading, setLoading] = useState(true)
  const [toast,   setToast]   = useState<Toast | null>(null)

  function showToast(msg: string, type: Toast['type'] = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    const { data } = await supabase
      .from('profiles').select('*').order('created_at', { ascending: false })
    setUsers((data || []) as UserRow[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // Organizer is a capability now, not a role — toggling it never touches `role`,
  // which only ever distinguishes admins from everyone else.
  async function setOrganizerAccess(user: UserRow, value: boolean) {
    const { error } = await supabase.from('profiles').update({ is_organizer: value }).eq('id', user.id)
    if (error) { showToast('Update failed.', 'error'); return }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_organizer: value } : u))
    showToast(`${user.full_name || user.email} ${value ? 'now has' : 'no longer has'} organizer access.`)
  }

  const filtered = users.filter(u => {
    if (filter === 'organizer' && !u.is_organizer) return false
    if (filter === 'attendee' && (u.is_organizer || u.role === 'admin')) return false
    if (search && !`${u.full_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function roleColor(user: UserRow) {
    if (user.role === 'admin') return { bg: 'rgba(239,68,68,0.12)',  text: '#FCA5A5' }
    if (user.is_organizer)     return { bg: 'rgba(194,130,13,0.12)', text: '#C2820D' }
    return                            { bg: 'rgba(31,122,104,0.12)', text: '#27967F' }
  }

  function roleLabel(user: UserRow) {
    if (user.role === 'admin') return user.is_organizer ? 'Admin · Organizer' : 'Admin'
    return user.is_organizer ? 'Organizer' : 'Attendee'
  }

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl font-body text-sm font-semibold shadow-xl"
          style={{ background: toast.type === 'success' ? '#1F7A68' : '#EF4444', color: 'var(--v-text)' }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <div className="sec-label sec-label-left mb-4"><span>User Management</span></div>
        <h1 className="h-lg mb-2" style={{ color: 'var(--v-text)' }}>Platform users</h1>
        <p className="font-body text-sm" style={{ color: 'var(--v-ghost)' }}>
          View all registered accounts. Grant or revoke organizer access — every account starts as an attendee.
        </p>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          {(['all', 'attendee', 'organizer'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="text-xs font-body font-semibold px-4 py-2 rounded-xl transition-all capitalize"
              style={{
                background: filter === f ? 'rgba(194,130,13,0.14)' : 'var(--v-border)',
                color:      filter === f ? '#C2820D'               : 'var(--v-ghost)',
                border:     `1px solid ${filter === f ? 'rgba(194,130,13,0.28)' : 'var(--v-border-s)'}`,
              }}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
            style={{ color: 'var(--v-ghost)' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input className="search-input" type="text" placeholder="Search by name or email…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Summary strip */}
      <div className="flex gap-6">
        {[
          { label: 'Total',      count: users.length },
          { label: 'Attendees',  count: users.filter(u => !u.is_organizer && u.role !== 'admin').length },
          { label: 'Organizers', count: users.filter(u => u.is_organizer).length },
          { label: 'Admins',     count: users.filter(u => u.role === 'admin').length },
        ].map(({ label, count }) => (
          <div key={label}>
            <p className="font-display font-bold text-xl" style={{ color: 'var(--v-text)' }}>{count}</p>
            <p className="font-body text-xs" style={{ color: 'var(--v-ghost)' }}>{label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="gcard rounded-2xl p-10 flex justify-center">
          <div className="spinner w-7 h-7 rounded-full border-2"
            style={{ borderColor: 'rgba(194,130,13,0.2)', borderTopColor: '#C2820D' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="gcard rounded-2xl p-10 text-center">
          <p className="font-body text-sm" style={{ color: 'var(--v-ghost)' }}>No users found.</p>
        </div>
      ) : (
        <div className="gcard rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead style={{ borderBottom: '1px solid var(--v-border)' }}>
              <tr>
                {['User', 'Email', 'Access', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left p-4 font-body text-xs font-semibold"
                    style={{ color: 'var(--v-ghost)', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => {
                const rc = roleColor(user)
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--v-border)' }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs flex-shrink-0"
                          style={{ background: 'rgba(194,130,13,0.14)', color: '#D4970F' }}>
                          {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-body text-sm" style={{ color: 'var(--v-text)' }}>
                          {user.full_name || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-body text-sm" style={{ color: 'var(--v-muted)' }}>
                      {user.email}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-lg"
                        style={{ background: rc.bg, color: rc.text }}>
                        {roleLabel(user)}
                      </span>
                    </td>
                    <td className="p-4 font-body text-xs" style={{ color: 'var(--v-ghost)' }}>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {!user.is_organizer ? (
                          <button onClick={() => setOrganizerAccess(user, true)}
                            className="text-xs font-body font-semibold px-3 py-1.5 rounded-lg transition-all"
                            style={{ background: 'rgba(194,130,13,0.10)', color: '#C2820D' }}>
                            Grant Organizer Access
                          </button>
                        ) : (
                          <button onClick={() => setOrganizerAccess(user, false)}
                            className="text-xs font-body font-semibold px-3 py-1.5 rounded-lg transition-all"
                            style={{ background: 'var(--v-border)', color: 'var(--v-ghost)' }}>
                            Revoke Organizer Access
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
      }
