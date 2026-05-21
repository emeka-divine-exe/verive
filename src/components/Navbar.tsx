'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`nav-glass fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-[0_4px_40px_rgba(0,0,0,0.4)]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[66px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 cursor-pointer select-none">
          <div className="w-8 h-8 rounded-xl bg-primary glow flex items-center justify-center">
            <span className="font-display font-extrabold text-white text-sm leading-none">V</span>
          </div>
          <span className="font-display font-bold text-[#F0EAFF] text-[1.15rem] tracking-tight">
            Verivent<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Discover', href: '/events' },
            { label: 'Organizers', href: '/organizers' },
            { label: 'Categories', href: '/categories' },
            { label: 'About', href: '/about' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-[#F0EAFF]/50 hover:text-[#F0EAFF] transition-colors font-body"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:block text-sm text-[#F0EAFF]/50 hover:text-[#F0EAFF] transition-colors font-body"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn-pri text-white text-sm font-body font-semibold px-5 py-2.5 rounded-full"
          >
            Get Started
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 ml-1 p-1"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-5 bg-[#F0EAFF]/60 transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-5 bg-[#F0EAFF]/60 transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-[#F0EAFF]/60 transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0D0719]/95 backdrop-blur-xl px-6 py-6 flex flex-col gap-5">
          {[
            { label: 'Discover', href: '/events' },
            { label: 'Organizers', href: '/organizers' },
            { label: 'Categories', href: '/categories' },
            { label: 'About', href: '/about' },
            { label: 'Log in', href: '/login' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[#F0EAFF]/60 hover:text-[#F0EAFF] font-body text-base transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
