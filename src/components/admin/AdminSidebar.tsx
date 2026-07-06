'use client'
import { useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/admin',              label: 'Overview',     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { href: '/admin/organizers',   label: 'Organizers',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { href: '/admin/verification', label: 'Verification', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  { href: '/admin/events',       label: 'Events',       icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { href: '/admin/users',        label: 'Users',        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
]

export function AdminSidebar({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const SidebarContent = () => (
    <>
      <div className="px-2 mb-6 pb-5" style={{ borderBottom: '1px solid var(--v-border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-display font-bold text-sm" style={{ color: 'var(--v-text)' }}>Verive</span>
          <span className="text-[0.48rem] font-body font-bold uppercase px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(239,68,68,0.16)', color: '#FCA5A5', letterSpacing: '0.08em' }}>
            Admin
          </span>
        </div>
        <p className="text-[0.65rem] font-body" style={{ color: 'var(--v-ghost)' }}>
          Platform Command Center
        </p>
      </div>

      <nav className="space-y-1 mb-5">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-body transition-all"
              style={{
                background: active ? 'var(--v-gold-dim)' : 'transparent',
                color:      active ? 'var(--v-gold)'     : 'var(--v-ghost)',
                fontWeight: active ? 600 : 400,
              }}>
              {icon}{label}
            </Link>
          )
        })}
      </nav>

      <div style={{ height: '1px', background: 'var(--v-border)', marginBottom: '12px' }} />

      <Link href="/" target="_blank"
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-body transition-all mb-1"
        style={{ color: 'var(--v-ghost)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        View Site
      </Link>

      <button onClick={handleLogout}
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-body w-full transition-all"
        style={{ color: 'rgba(239,68,68,0.7)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Log out
      </button>
    </>
  )

  return (
    <div className="min-h-screen flex">

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 nav-glass">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-sm" style={{ color: 'var(--v-text)' }}>Verive</span>
          <span className="text-[0.48rem] font-body font-bold uppercase px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(239,68,68,0.16)', color: '#FCA5A5', letterSpacing: '0.08em' }}>
            Admin
          </span>
        </div>
        <button onClick={() => setOpen(o => !o)} aria-label="Menu"
          className="p-1.5 flex flex-col gap-1.5">
          <span className={`block h-0.5 w-5 transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`}
            style={{ background: 'var(--v-ghost)' }} />
          <span className={`block h-0.5 w-5 transition-all duration-300 ${open ? 'opacity-0' : ''}`}
            style={{ background: 'var(--v-ghost)' }} />
          <span className={`block h-0.5 w-5 transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`}
            style={{ background: 'var(--v-ghost)' }} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-40 w-72 transition-transform duration-300 pt-14 p-5 overflow-y-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--v-canvas)', borderRight: '1px solid var(--v-border)' }}>
        <SidebarContent />
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[240px] flex-shrink-0 p-6 sticky top-0 h-screen overflow-y-auto"
        style={{ borderRight: '1px solid var(--v-border)' }}>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-5 lg:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
