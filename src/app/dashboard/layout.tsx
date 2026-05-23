'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { label: 'Overview',       href: '/dashboard',            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'Saved Events',   href: '/dashboard/bookmarks',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> },
  { label: 'Settings',       href: '/dashboard/settings',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const [user,   setUser]   = useState<any>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen flex" style={{ background: '#0D0719' }}>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 nav-glass">
        <Link href="/" className="font-display font-bold text-base" style={{ color: '#F0EAFF' }}>
          Verivent<span style={{ color: '#7B3FE4' }}>.</span>
        </Link>
        <button onClick={() => setMobile(m => !m)} style={{ color: 'rgba(240,234,255,0.5)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`dash-sidebar fixed lg:static z-40 transition-transform duration-300
        ${mobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        top-0 lg:top-0 pt-20 lg:pt-6`}>

        {/* Logo */}
        <Link href="/" className="hidden lg:flex items-center gap-2 px-3 mb-8">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#7B3FE4' }}>
            <span className="font-display font-bold text-white text-xs">V</span>
          </div>
          <span className="font-display font-bold text-sm" style={{ color: '#F0EAFF' }}>Verivent<span style={{ color: '#7B3FE4' }}>.</span></span>
        </Link>

        {/* User */}
        <div className="flex items-center gap-3 px-3 mb-6 pb-5" style={{ borderBottom: '1px solid rgba(196,181,253,0.07)' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
            style={{ background: 'rgba(123,63,228,0.25)', color: '#C4B5FD' }}>{initials}</div>
          <div className="min-w-0">
            <div className="font-display font-semibold text-sm truncate" style={{ color: '#F0EAFF' }}>{name}</div>
            <div className="text-xs font-body truncate" style={{ color: 'rgba(240,234,255,0.28)' }}>Attendee</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="space-y-1 mb-6">
          {NAV.map(({ label, href, icon }) => (
            <Link key={href} href={href}
              className={`dash-nav-item ${pathname === href ? 'active' : ''}`}
              onClick={() => setMobile(false)}>
              {icon}{label}
            </Link>
          ))}
        </nav>

        {/* Browse events */}
        <div className="px-2 mb-4">
          <Link href="/events" className="btn-pri w-full py-2.5 text-xs rounded-xl">
            Browse Events
          </Link>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="dash-nav-item w-full mt-auto" style={{ color: 'rgba(239,68,68,0.6)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Log out
        </button>
      </aside>

      {/* Overlay mobile */}
      {mobile && <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobile(false)} />}

      {/* Main */}
      <main className="flex-1 min-w-0 lg:ml-0 pt-14 lg:pt-0 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
