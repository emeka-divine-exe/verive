import Link from 'next/link'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/data'

export default function CategoriesPage() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="container-page">
        <div className="max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: '#7B3FE4' }}>
            Categories
          </span>
          <h1 className="mt-4 text-5xl font-bold leading-tight" style={{ color: '#F0EAFF' }}>
            Explore event ecosystems.
          </h1>
          <p className="mt-5 text-base leading-relaxed" style={{ color: 'rgba(240,234,255,0.45)' }}>
            Category discovery is now driven by Supabase records. As you add organizers and events, these filters become more useful.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_ORDER.map((category) => {
            const meta = CATEGORY_META[category]
            return (
              <Link key={category} href={`/events?category=${category}`} className="gcard rounded-2xl p-6 transition-all hover:translate-y-[-2px]">
                <div className="text-4xl mb-5">{meta.emoji}</div>
                <h2 className="text-xl font-semibold mb-3" style={{ color: '#F0EAFF' }}>{meta.label}</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,234,255,0.4)' }}>
                  Browse {meta.label.toLowerCase()} events and organizers from your database.
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
