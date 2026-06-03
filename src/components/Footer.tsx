import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t pt-16 pb-10" style={{ borderColor: 'rgba(240,232,214,0.06)' }}>
      <div className="container-page">
        <div className="grid md:grid-cols-4 gap-10 mb-14">

          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="font-display font-bold text-base" style={{ color: '#F0E8D6' }}>
                Verive
              </span>
              <span
                className="text-[0.55rem] font-body font-bold uppercase px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(194,130,13,0.14)', color: '#C2820D', letterSpacing: '0.1em' }}
              >
                Beta
              </span>
            </div>
            <p className="font-body text-sm leading-relaxed max-w-xs mb-6" style={{ color: 'rgba(240,232,214,0.28)' }}>
              Trust-first event discovery for the Lagos tech, design, and startup ecosystem. Show up to what matters.
            </p>
            <div className="flex gap-5">
              {['Twitter', 'Instagram', 'LinkedIn'].map(s => (
                <a
                  key={s}
                  href="#"
                  className="text-xs font-body transition-colors hover:text-[#F0E8D6]"
                  style={{ color: 'rgba(240,232,214,0.22)' }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-5" style={{ color: '#F0E8D6' }}>Platform</h4>
            <ul className="space-y-3">
              {[
                ['Discover Events',    '/events'],
                ['Organizers',         '/organizers'],
                ['Apply as Organiser', '/organizer/apply'],
                ['How it Works',       '/about'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm font-body transition-colors hover:text-[#F0E8D6]"
                    style={{ color: 'rgba(240,232,214,0.28)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-5" style={{ color: '#F0E8D6' }}>Company</h4>
            <ul className="space-y-3">
              {[
                ['About',          '/about'],
                ['Privacy Policy', '/privacy'],
                ['Terms of Use',   '/terms'],
                ['Contact',        '/contact'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm font-body transition-colors hover:text-[#F0E8D6]"
                    style={{ color: 'rgba(240,232,214,0.28)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between pt-8 border-t"
          style={{ borderColor: 'rgba(240,232,214,0.06)' }}
        >
          <p className="text-xs font-body" style={{ color: 'rgba(240,232,214,0.18)' }}>
            © {new Date().getFullYear()} Verive. Built for the community.
          </p>
          <p className="text-xs font-body mt-2 md:mt-0" style={{ color: 'rgba(194,130,13,0.4)' }}>
            Verified · Trusted · Worth Showing Up For
          </p>
        </div>
      </div>
    </footer>
  )
}
