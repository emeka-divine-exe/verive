import Link from 'next/link'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/data'

export default function CategoriesPage() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="container-page">

        <div className="max-w-2xl mb-14">
          <div className="sec-label sec-label-left mb-6">
            <span>Browse</span>
          </div>
          <h1 className="h-xl mb-5" style={{ color: '#F0E8D6' }}>
            Find your<br />
            <span className="gradient-text">ecosystem.</span>
          </h1>
          <p className="font-body text-base leading-relaxed" style={{ color: 'rgba(240,232,214,0.42)' }}>
            From engineering and product to design and community — Verive covers the full Lagos tech landscape. Filter by what matters to you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORY_ORDER.map((category) => {
            const meta = CATEGORY_META[category]
            return (
              <Link
                key={category}
                href={`/events?category=${category}`}
                className="gcard rounded-2xl p-6 block transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-5">{meta.emoji}</div>
                <h2 className="font-display font-semibold text-lg mb-2"
                  style={{ color: '#F0E8D6', letterSpacing: '-0.01em' }}>
                  {meta.label}
                </h2>
                <p className="font-body text-sm leading-relaxed"
                  style={{ color: 'rgba(240,232,214,0.38)' }}>
                  Explore {meta.label.toLowerCase()} events from verified organizers.
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
