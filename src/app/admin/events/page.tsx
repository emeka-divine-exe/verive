export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-violet-300 mb-3">Event Management</p>
        <h1 className="text-4xl font-semibold text-white mb-3">Events Workspace</h1>
        <p className="text-white/45 max-w-2xl">
          This section is structured for Supabase-powered event management, approvals, featured events, and organizer submissions.
        </p>
      </div>

      <div className="gcard rounded-3xl p-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 p-5">
            <h2 className="text-white text-lg font-semibold mb-2">Draft Events</h2>
            <p className="text-white/45 text-sm">Organizer-submitted events pending moderation.</p>
          </div>

          <div className="rounded-2xl border border-white/10 p-5">
            <h2 className="text-white text-lg font-semibold mb-2">Featured Queue</h2>
            <p className="text-white/45 text-sm">High-priority events selected for homepage visibility.</p>
          </div>

          <div className="rounded-2xl border border-white/10 p-5">
            <h2 className="text-white text-lg font-semibold mb-2">Publishing</h2>
            <p className="text-white/45 text-sm">Database-connected publishing and status management.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
