'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UserRow {
  id:         string
  full_name:  string | null
  email:      string | null
  role:       string | null
  verified:   boolean | null
  created_at: string | null
  banned?:    boolean
}

interface Toast { msg: string; type: 'success' | 'error' }

export default function AdminUsersPage() {
  const supabase = createClient()
  const [users,   setUsers]   = useState<UserRow[]>([])
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState<'all' | 'user' | 'organizer'>('all')
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

  async function changeRole(user: UserRow, newRole: string) {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    if (error) { showToast('Update failed.', 'error'); return }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u))
    showToast(`${user.full_name || user.email} is now ${newRole}.`)
  }

  const filtered = users.filter(u => {
    if (filter !== 'all' && u.role !== filter) return false
    if (search && !`${u.full_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const roleColor = (role: string | null) => {
    if (role === 'admin')     return { bg: 'rgba(239,68,68,0.12)',    text: '#FCA5A5' }
    if (role === 'organizer') return { bg: 'rgba(194,130,13,0.12)',   text: '#C2820D' }
    return                           { bg: 'rgba(31,122,104,0.12)',   text: '#27967F' }
  }

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
        <div className="sec-label sec-label-left mb-4"><span>User Management</span></div>
        <h1 className="h-lg mb-2" style={{ color: '#F0E8D6' }}>Platform users</h1>
        <p className="font-body text-sm" style={{ color: 'rgba(240,232,214,0.38)' }}>
          View all registered users. Change roles or manage platform access.
        </p>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          {(['all', 'user', 'organizer'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="text-xs font-body font-semibold px-4 py-2 rounded-xl transition-all capitalize"
              style={{
                background: filter === f ? 'rgba(194,130,13,0.14)' : 'rgba(240,232,214,0.04)',
                color:      filter === f ? '#C2820D'               : 'rgba(240,232,214,0.36)',
                border:     `1px solid ${filter === f ? 'rgba(194,130,13,0.28)' : 'rgba(240,232,214,0.07)'}`,
              }}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
            style={{ color: 'rgba(240,232,214,0.22)' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input className="search-input" type="text" placeholder="Search by name or email…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Summary strip */}
      <div className="flex gap-6">
        {[
          { label: 'Total',       count: users.length },
          { label: 'Attendees',   count: users.filter(u => u.role === 'user').length },
          { label: 'Organizers',  count: users.filter(u => u.role === 'organizer').length },
          { label: 'Admins',      count: users.filter(u => u.role === 'admin').length },
        ].map(({ label, count }) => (
          <div key={label}>
            <p className="font-display font-bold text-xl" style={{ color: '#F0E8D6' }}>{count}</p>
            <p className="font-body text-xs" style={{ color: 'rgba(240,232,214,0.32)' }}>{label}</p>
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
          <p className="font-body text-sm" style={{ color: 'rgba(240,232,214,0.32)' }}>No users found.</p>
        </div>
      ) : (
        <div className="gcard rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead style={{ borderBottom: '1px solid rgba(240,232,214,0.07)' }}>
              <tr>
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left p-4 font-body text-xs font-semibold"
                    style={{ color: 'rgba(240,232,214,0.32)', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => {
                const rc = roleColor(user.role)
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(240,232,214,0.05)' }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs flex-shrink-0"
                          style={{ background: 'rgba(194,130,13,0.14)', color: '#D4970F' }}>
                          {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-body text-sm" style={{ color: '#F0E8D6' }}>
                          {user.full_name || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-body text-sm" style={{ color: 'rgba(240,232,214,0.40)' }}>
                      {user.email}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-lg capitalize"
                        style={{ background: rc.bg, color: rc.text }}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="p-4 font-body text-xs" style={{ color: 'rgba(240,232,214,0.32)' }}>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {user.role !== 'organizer' && (
                          <button onClick={() => changeRole(user, 'organizer')}
                            className="text-xs font-body font-semibold px-3 py-1.5 rounded-lg transition-all"
                            style={{ background: 'rgba(194,130,13,0.10)', color: '#C2820D' }}>
                            Make Organizer
                          </button>
                        )}
                        {user.role !== 'user' && (
                          <button onClick={() => changeRole(user, 'user')}
                            className="text-xs font-body font-semibold px-3 py-1.5 rounded-lg transition-all"
                            style={{ background: 'rgba(240,232,214,0.06)', color: 'rgba(240,232,214,0.40)' }}>
                            Set as User
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
