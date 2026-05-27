import Link from 'next/link'
import { Footer } from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="page-header">
        <div className="container-page py-24">
          <div className="max-w-3xl">
            <div className="sec-label sec-label-left mb-6">
              <span>About Verivent</span>
            </div>

            <h1 className="h-xl mb-6" style={{ color: '#F0EAFF' }}>
              Discover verified tech and creative events across Africa.
            </h1>

            <p className="font-body text-lg leading-relaxed" style={{ color: 'rgba(240,234,255,0.42)' }}>
              Verivent helps people discover high-quality events from trusted organizers.
              Every listing on the platform is designed to be cleaner, easier to discover,
              and more reliable than fragmented event posts scattered across social media.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Verified Organizers',
              body: 'Organizers are reviewed before events appear on the platform.',
            },
            {
              title: 'Curated Discovery',
              body: 'The platform prioritizes quality events instead of noisy feeds.',
            },
            {
              title: 'Built For Africa',
              body: 'Focused on African tech, startup, design, and career ecosystems.',
            },
          ].map((item) => (
            <div key={item.title} className="gcard rounded-2xl p-6">
              <h3 className="h-md mb-3" style={{ color: '#F0EAFF' }}>
                {item.title}
              </h3>

              <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(240,234,255,0.38)' }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 gcard rounded-3xl p-10 text-center">
          <h2 className="h-lg mb-4" style={{ color: '#F0EAFF' }}>
            Ready to discover your next event?
          </h2>

          <p className="font-body mb-8" style={{ color: 'rgba(240,234,255,0.38)' }}>
            Browse verified opportunities from trusted communities and companies.
          </p>

          <Link href="/events" className="btn-pri text-white font-semibold px-8 py-4 inline-flex">
            Browse Events
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
