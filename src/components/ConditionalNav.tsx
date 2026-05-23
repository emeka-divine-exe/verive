'use client'
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

// Pages that have their own layout (no public nav/footer)
const NO_NAV_PREFIXES = [
  '/login', '/signup', '/forgot-password', '/reset-password', '/verify-email',
  '/dashboard', '/organizer',
]

export function ConditionalNav() {
  const pathname = usePathname()
  const hideNav  = NO_NAV_PREFIXES.some(prefix => pathname.startsWith(prefix))
  if (hideNav) return null
  return <Navbar />
}
