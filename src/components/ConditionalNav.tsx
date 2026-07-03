'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/Navbar'

const HIDDEN_PREFIXES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/dashboard',
  '/organizers/dashboard',
  '/organizers/events',
  '/organizers/media',
  '/organizers/settings',
  '/organizers/apply',
  '/admin',
]

export function ConditionalNav() {
  const pathname = usePathname()
  const hideNav = HIDDEN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  if (hideNav) return null
  return <Navbar />
}
