import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="container-page max-w-4xl">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: '#7B3FE4' }}>
          About Verivent
        </span>
        <h1 className="mt-4 text-5xl font-bold leading-tight" style={{ color: '#F0EAFF' }}>
          Curated events. Verified organizers. Better discovery.
        </h1>
        <p className="mt-5 text-base leading-relaxed" style={{ color: 'rgba(240,234,255,0.45)' }}>
          Verivent is a trust-first event discovery platform built for Africa&apos;s tech, design, and startup ecosystems.
          The product now runs on Supabase instead of mock data, so the homepage, organizer pages, and event feeds respond to live records.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mt-10">
          {[
            ['Verified discovery', 'Curate events that people can trust.'],
            ['Organizer workflows', 'Manage profiles, events, media, and publishing.'],
            ['Scalable foundation', 'Drive the UI from the database, not local arrays.'],
          ].map(([title, desc]) => (
            <div key={title} className="gcard rounded-2xl p-5">
              <h2 className="font-display font-semibold text-lg mb-2" style={{ color: '#F0EAFF' }}>{title}</h2>
              <p className="text-sm font-body" style={{ color: 'rgba(240,234,255,0.36)' }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-3">
          <Link href="/events" className="btn-pri text-white font-semibold px-7 py-3.5 text-sm">
            Explore Events
          </Link>
          <Link href="/organizers" className="btn-ghost px-7 py-3.5 text-sm">
            Browse Organizers
          </Link>
        </div>
      </div>
    </main>
  )
}
