'use client'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { VerifiedBadge } from '@/components/VerifiedBadge'

const DASHBOARD_PATHS = [
  '/organizers/dashboard',
  '/organizers/events',
  '/organizers/media',
  '/organizers/settings',
  '/organizers/apply',
]

const NAV = [
  { label: 'Dashboard', href: '/organizers/dashboard',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'My Events', href: '/organizers/events',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: 'Post Event', href: '/organizers/events/new', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { label: 'Media',     href: '/organizers/media',      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="m21 15-5-5L5 21"/></svg> },
  { label: 'Settings',  href: '/organizers/settings',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
]

export default function OrganizerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const [user,    setUser]    = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [mobile,  setMobile]  = useState(false)

  const isDashboardRoute = useMemo(
    () => DASHBOARD_PATHS.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)),
    [pathname],
  )

  useEffect(() => {
    if (!isDashboardRoute) return
    let mounted = true
    supabase.auth.getUser().then(async ({ data }) => {
      if (!mounted) return
      if (!data.user) { router.replace('/login'); return }
      setUser(data.user)
      const { data: prof } = await supabase
        .from('profiles').select('*').eq('id', data.user.id).maybeSingle()
      if (!mounted) return
      setProfile(prof)
      if (prof && prof.role !== 'organizer' && prof.role !== 'admin') {
        router.replace('/dashboard')
      }
    })
    return () => { mounted = false }
  }, [isDashboardRoute, router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (!isDashboardRoute) return <>{children}</>

  const name       = profile?.full_name || user?.email?.split('@')[0] || 'Organizer'
  const initials   = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'OR'
  const isVerified = profile?.verified === true

  return (
    <div className="min-h-screen flex" style={{ background: '#06091A' }}>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 nav-glass">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display font-bold text-base" style={{ color: '#F0E8D6' }}>Verive</span>
          <span className="text-[0.5rem] font-body font-bold uppercase px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(194,130,13,0.14)', color: '#C2820D', letterSpacing: '0.1em' }}>Beta</span>
        </Link>
        <button onClick={() => setMobile(m => !m)} style={{ color: 'rgba(240,232,214,0.5)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`dash-sidebar fixed lg:static z-40 transition-transform duration-300
        ${mobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        top-0 lg:top-0 pt-20 lg:pt-6`}>

        {/* Wordmark */}
        <Link href="/" className="hidden lg:flex items-center gap-2 px-3 mb-8">
          <span className="font-display font-bold text-sm" style={{ color: '#F0E8D6' }}>Verive</span>
          <span className="text-[0.5rem] font-body font-bold uppercase px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(194,130,13,0.14)', color: '#C2820D', letterSpacing: '0.1em' }}>Beta</span>
        </Link>

        {/* User */}
        <div className="px-3 mb-6 pb-5" style={{ borderBottom: '1px solid rgba(240,232,214,0.06)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
              style={{ background: 'rgba(194,130,13,0.16)', color: '#D4970F' }}>
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-semibold text-sm truncate" style={{ color: '#F0E8D6' }}>{name}</span>
                {isVerified && <VerifiedBadge size={13} />}
              </div>
              <div className="text-xs font-body" style={{ color: 'rgba(240,232,214,0.30)' }}>
                {isVerified ? 'Verified Organizer' : 'Organizer'}
              </div>
            </div>
          </div>

          {!isVerified && (
            <Link href="/organizers/apply"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-body mt-2 transition-all"
              style={{ background: 'rgba(31,122,104,0.10)', border: '1px solid rgba(31,122,104,0.25)', color: '#27967F' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Request Verified Badge
            </Link>
          )}
        </div>

        {/* Nav */}
        <nav className="space-y-1 mb-6">
          {NAV.map(({ label, href, icon }) => (
            <Link key={href} href={href}
              className={`dash-nav-item ${pathname === href || pathname.startsWith(`${href}/`) ? 'active' : ''}`}
              onClick={() => setMobile(false)}>
              {icon}{label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button onClick={handleLogout} className="dash-nav-item w-full"
          style={{ color: 'rgba(239,68,68,0.6)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Log out
        </button>
      </aside>

      {mobile && <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobile(false)} />}

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 overflow-y-auto">
        {children}
      </main>
    </div>
  )
      }
