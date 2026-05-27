
import Link from 'next/link'

const categories = [
  {
    name: 'Technology',
    slug: 'tech',
    emoji: '💻',
    description: 'Hackathons, developer meetups, engineering conferences and AI events.',
  },
  {
    name: 'Design',
    slug: 'design',
    emoji: '🎨',
    description: 'UI/UX, branding, product design and creative community events.',
  },
  {
    name: 'Startup',
    slug: 'startup',
    emoji: '🚀',
    description: 'Founder meetups, pitch nights, startup networking and VC events.',
  },
  {
    name: 'Career',
    slug: 'career',
    emoji: '💼',
    description: 'Career fairs, internships, job networking and mentorship sessions.',
  },
  {
    name: 'Community',
    slug: 'community',
    emoji: '🌍',
    description: 'Local community gatherings, tech communities and social impact events.',
  },
]

export default function CategoriesPage() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="container-page">
        <div className="max-w-2xl mb-14">
          <span
            className="text-xs uppercase tracking-[0.2em] font-semibold"
            style={{ color: '#7B3FE4' }}
          >
            Categories
          </span>

          <h1
            className="mt-4 text-5xl font-bold leading-tight"
            style={{ color: '#F0EAFF' }}
          >
            Explore event ecosystems.
          </h1>

          <p
            className="mt-5 text-base leading-relaxed"
            style={{ color: 'rgba(240,234,255,0.45)' }}
          >
            Browse curated categories across Africa’s growing tech,
            startup, design and professional communities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/events?category=${category.slug}`}
              className="gcard rounded-2xl p-6 transition-all hover:translate-y-[-2px]"
            >
              <div className="text-4xl mb-5">{category.emoji}</div>

              <h2
                className="text-xl font-semibold mb-3"
                style={{ color: '#F0EAFF' }}
              >
                {category.name}
              </h2>

              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(240,234,255,0.4)' }}
              >
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
