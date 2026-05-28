export default function AdminPostsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-violet-300 mb-3">Content System</p>
        <h1 className="text-4xl font-semibold text-white mb-3">Editorial Publishing</h1>
        <p className="text-white/45 max-w-2xl">
          Publish announcements, ecosystem updates, blog posts, and platform editorial content.
        </p>
      </div>

      <div className="gcard rounded-3xl p-8">
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 p-5">
            <h2 className="text-white text-lg font-semibold mb-2">Post Categories</h2>
            <p className="text-white/45 text-sm">Technology, design, startup, career, and community content segmentation.</p>
          </div>

          <div className="rounded-2xl border border-white/10 p-5">
            <h2 className="text-white text-lg font-semibold mb-2">Content Scheduling</h2>
            <p className="text-white/45 text-sm">Support draft, scheduled, and published states for editorial workflows.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
