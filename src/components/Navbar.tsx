'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const LINKS = [
  { label: 'Discover',   href: '/events' },
  { label: 'Organizers', href: '/organizers' },
  { label: 'Categories', href: '/categories' },
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

        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <span className="font-display font-bold text-[1.08rem] tracking-tight" style={{ color: '#F0E8D6' }}>
            Verive
          </span>
          <span
            className="text-[0.55rem] font-body font-bold uppercase px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(194,130,13,0.14)', color: '#C2820D', letterSpacing: '0.1em' }}
          >
            Beta
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-body transition-colors"
              style={{ color: pathname.startsWith(href) ? '#F0E8D6' : 'rgba(240,232,214,0.38)' }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:block text-sm font-body transition-colors"
            style={{ color: 'rgba(240,232,214,0.38)' }}
          >
            Log in
          </Link>
          <Link href="/signup" className="btn-pri text-sm px-5 py-2.5">
            Get Started
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden ml-1 p-1.5 flex flex-col gap-1.5"
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
          >
            <span className={`block h-0.5 w-5 transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} style={{ background: 'rgba(240,232,214,0.6)' }} />
            <span className={`block h-0.5 w-5 transition-all duration-300 ${open ? 'opacity-0' : ''}`} style={{ background: 'rgba(240,232,214,0.6)' }} />
            <span className={`block h-0.5 w-5 transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} style={{ background: 'rgba(240,232,214,0.6)' }} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-80' : 'max-h-0'}`}>
        <div
          className="border-t px-6 py-5 flex flex-col gap-4"
          style={{ background: 'rgba(6,9,26,0.97)', borderColor: 'rgba(240,232,214,0.06)' }}
        >
          {[...LINKS, { label: 'Log in', href: '/login' }].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-base font-body"
              style={{ color: 'rgba(240,232,214,0.5)' }}
            >
              {label}
            </Link>
          ))}
          <Link href="/signup" className="btn-pri text-sm px-5 py-3 text-center mt-1">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}
