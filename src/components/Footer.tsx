import Link from 'next/link'

const platform = [
  { label: 'Discover Events',    href: '/events' },
  { label: 'Organizers',         href: '/organizers' },
  { label: 'Categories',         href: '/categories' },
  { label: 'Apply as Organizer', href: '/apply' },
]
const company = [
  { label: 'About',          href: '/about' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use',   href: '/terms' },
  { label: 'Contact',        href: '/contact' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary glow flex items-center justify-center">
                <span className="font-display font-extrabold text-white text-xs">V</span>
              </div>
              <span className="font-display font-bold text-[#F0EAFF] text-base">
                Verivent<span className="text-primary">.</span>
              </span>
            </div>
            <p className="font-body text-[#F0EAFF]/28 text-sm leading-relaxed max-w-xs">
              The trusted platform for discovering verified, high-value events in tech, design, and startup ecosystems.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display font-semibold text-[#F0EAFF] text-sm mb-5">Platform</h4>
            <ul className="space-y-3">
              {platform.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-[#F0EAFF]/28 hover:text-[#F0EAFF] transition-colors font-body">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-[#F0EAFF] text-sm mb-5">Company</h4>
            <ul className="space-y-3">
              {company.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-[#F0EAFF]/28 hover:text-[#F0EAFF] transition-colors font-body">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.05]">
          <p className="text-xs text-[#F0EAFF]/18 font-body">
            © {new Date().getFullYear()} Verivent. Built for the community.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            {['Twitter', 'Instagram', 'LinkedIn'].map((s) => (
              <a key={s} href="#" className="text-xs text-[#F0EAFF]/22 hover:text-[#F0EAFF] transition-colors font-body">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
