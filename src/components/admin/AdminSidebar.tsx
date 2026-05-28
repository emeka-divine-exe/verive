'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/organizers', label: 'Organizers' },
  { href: '/admin/posts', label: 'Posts' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="gcard rounded-3xl p-6 h-fit sticky top-24">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Verivent CMS</p>
        <h2 className="text-2xl font-semibold text-white mt-2">Admin Panel</h2>
      </div>

      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-2xl px-4 py-3 transition-all ${pathname === item.href ? 'bg-violet-600 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
