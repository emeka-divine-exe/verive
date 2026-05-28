import Link from 'next/link'
import { AdminStatCard } from '@/components/admin/AdminStatCard'
import { adminStats, recentActivity } from '@/lib/admin'

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-300 mb-4">Admin Core</p>
        <h1 className="text-5xl font-semibold text-white mb-4">Platform command center.</h1>
        <p className="text-white/50 max-w-2xl">
          Moderate organizers, manage events, upload content, and oversee the Verivent ecosystem.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {adminStats.map((stat) => (
          <AdminStatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-6 mb-6">
        <div className="gcard rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Quick Actions</h2>
              <p className="text-white/40 text-sm mt-1">Core administrative workflows.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/admin/events" className="rounded-2xl border border-white/10 p-5 hover:bg-white/5 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2">Events</h3>
              <p className="text-sm text-white/45">Manage drafts, featured events, and moderation.</p>
            </Link>

            <Link href="/admin/organizers" className="rounded-2xl border border-white/10 p-5 hover:bg-white/5 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2">Organizers</h3>
              <p className="text-sm text-white/45">Verification workflows and organizer onboarding.</p>
            </Link>

            <Link href="/admin/categories" className="rounded-2xl border border-white/10 p-5 hover:bg-white/5 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2">Categories</h3>
              <p className="text-sm text-white/45">Visibility, metadata, and content organization.</p>
            </Link>

            <Link href="/admin/media" className="rounded-2xl border border-white/10 p-5 hover:bg-white/5 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2">Media</h3>
              <p className="text-sm text-white/45">Storage uploads and asset management.</p>
            </Link>
          </div>
        </div>

        <div className="gcard rounded-3xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity} className="border border-white/10 rounded-2xl p-4 text-sm text-white/60">
                {activity}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
