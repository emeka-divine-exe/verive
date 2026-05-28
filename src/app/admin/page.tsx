import Link from 'next/link'

const stats = [
  { label: 'Published Events', value: '0' },
  { label: 'Verified Organizers', value: '0' },
  { label: 'Published Posts', value: '0' },
  { label: 'Pending Reviews', value: '0' },
]

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-300 mb-4">Dashboard Overview</p>
        <h1 className="text-5xl font-semibold text-white mb-4">Control your platform.</h1>
        <p className="text-white/50 max-w-2xl">
          Manage events, organizers, editorial content, and platform moderation from a centralized admin workspace.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="gcard rounded-3xl p-6">
            <p className="text-white/40 text-sm mb-3">{stat.label}</p>
            <h2 className="text-4xl font-bold text-white">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="gcard rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Quick Actions</h2>
              <p className="text-white/40 text-sm mt-1">Core management workflows.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/admin/events" className="rounded-2xl border border-white/10 p-5 hover:bg-white/5 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2">Manage Events</h3>
              <p className="text-sm text-white/45">Create, feature, edit, and moderate platform events.</p>
            </Link>

            <Link href="/admin/organizers" className="rounded-2xl border border-white/10 p-5 hover:bg-white/5 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2">Organizer Directory</h3>
              <p className="text-sm text-white/45">Review organizer applications and verification status.</p>
            </Link>

            <Link href="/admin/posts" className="rounded-2xl border border-white/10 p-5 hover:bg-white/5 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2">Publish Content</h3>
              <p className="text-sm text-white/45">Manage editorial posts, announcements, and updates.</p>
            </Link>
          </div>
        </div>

        <div className="gcard rounded-3xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-5">Foundation Phase</h2>
          <ul className="space-y-4 text-sm text-white/55">
            <li>• Database-first architecture with Supabase integration</li>
            <li>• Event and organizer management foundation</li>
            <li>• Content publishing workflow</li>
            <li>• Expandable moderation system</li>
            <li>• Scalable admin navigation structure</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
