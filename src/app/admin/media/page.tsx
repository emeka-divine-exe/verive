export default function MediaPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-300 mb-4">Media Library</p>
        <h1 className="text-4xl font-semibold text-white mb-3">Storage & Uploads</h1>
        <p className="text-white/50 max-w-2xl">Supabase storage integration foundation for event covers and organizer assets.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="gcard rounded-3xl p-5 aspect-square flex items-center justify-center text-white/30 border border-white/10">
            Media Preview
          </div>
        ))}
      </div>
    </div>
  )
}
