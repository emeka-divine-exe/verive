'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const LINKS = [
  { label: 'Discover',   href: '/events' },
  { label: 'Organizers', href: '/organizers' },
  { label: 'Categories', href: '/categories' },
  { label: 'About',      href: '/about' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <nav className={`nav-glass fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-[0_4px_40px_rgba(0,0,0,0.5)]' : ''}`}>
      <div className="container-page h-[66px] flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 rounded-xl bg-primary glow flex items-center justify-center flex-shrink-0" style={{ background: '#7B3FE4' }}>
            <span className="font-display font-bold text-white text-sm leading-none">V</span>
          </div>
          <span className="font-display font-bold text-fg text-[1.08rem] tracking-tight" style={{ color: '#F0EAFF' }}>
            Verivent<span style={{ color: '#7B3FE4' }}>.</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {LINKS.map(({ label, href }) => (
            <Link key={label} href={href}
              className="text-sm font-body transition-colors"
              style={{ color: pathname.startsWith(href) ? '#F0EAFF' : 'rgba(240,234,255,0.42)' }}>
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden md:block text-sm font-body transition-colors" style={{ color: 'rgba(240,234,255,0.42)' }}>
            Log in
          </Link>
          <Link href="/signup" className="btn-pri text-sm px-5 py-2.5 text-white font-semibold">
            Get Started
          </Link>
          <button className="md:hidden ml-1 p-1.5 flex flex-col gap-1.5" onClick={() => setOpen(o => !o)} aria-label="Menu">
            <span className={`block h-0.5 w-5 bg-white/60 transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-5 bg-white/60 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-white/60 transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-80' : 'max-h-0'}`}>
        <div className="border-t border-white/[0.06] bg-void/95 backdrop-blur-xl px-6 py-5 flex flex-col gap-4" style={{ background: 'rgba(13,7,25,0.95)' }}>
          {[...LINKS, { label: 'Log in', href: '/login' }].map(({ label, href }) => (
            <Link key={label} href={href} className="text-base font-body transition-colors" style={{ color: 'rgba(240,234,255,0.5)' }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
