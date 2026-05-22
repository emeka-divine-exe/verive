import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] pt-16 pb-10">
      <div className="container-page">
        <div className="grid md:grid-cols-4 gap-10 mb-14">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#7B3FE4' }}>
                <span className="font-display font-bold text-white text-xs">V</span>
              </div>
              <span className="font-display font-bold text-fg text-base" style={{ color: '#F0EAFF' }}>
                Verivent<span style={{ color: '#7B3FE4' }}>.</span>
              </span>
            </div>
            <p className="font-body text-sm leading-relaxed max-w-xs mb-6" style={{ color: 'rgba(240,234,255,0.26)' }}>
              The trusted platform for discovering verified, high-value events in tech, design, and startup ecosystems across Africa.
            </p>
            <div className="flex gap-5">
              {['Twitter','Instagram','LinkedIn','TikTok'].map(s => (
                <a key={s} href="#" className="text-xs font-body transition-colors hover:text-fg" style={{ color: 'rgba(240,234,255,0.2)' }}>{s}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-fg text-sm mb-5" style={{ color: '#F0EAFF' }}>Platform</h4>
            <ul className="space-y-3">
              {[['Discover Events','/events'],['Organizers','/organizers'],['Categories','/categories'],['Apply as Organizer','/apply']].map(([l,h]) => (
                <li key={l}><Link href={h} className="text-sm font-body transition-colors hover:text-fg" style={{ color: 'rgba(240,234,255,0.26)' }}>{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-fg text-sm mb-5" style={{ color: '#F0EAFF' }}>Company</h4>
            <ul className="space-y-3">
              {[['About','/about'],['Privacy Policy','/privacy'],['Terms of Use','/terms'],['Contact','/contact']].map(([l,h]) => (
                <li key={l}><Link href={h} className="text-sm font-body transition-colors hover:text-fg" style={{ color: 'rgba(240,234,255,0.26)' }}>{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.05]">
          <p className="text-xs font-body" style={{ color: 'rgba(240,234,255,0.16)' }}>© {new Date().getFullYear()} Verivent. Built for the community.</p>
          <p className="text-xs font-body mt-2 md:mt-0" style={{ color: 'rgba(240,234,255,0.1)' }}>Curated · Verified · Trusted</p>
        </div>
      </div>
    </footer>
  )
}
