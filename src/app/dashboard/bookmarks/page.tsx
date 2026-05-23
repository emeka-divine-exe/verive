'use client'
import Link from 'next/link'

export default function BookmarksPage() {
  // Will connect to Supabase bookmarks table in Phase 2
  // For now shows empty state with clear CTA
  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="h-lg mb-1" style={{ color: '#F0EAFF' }}>Saved Events</h1>
        <p className="font-body text-sm" style={{ color: 'rgba(240,234,255,0.35)' }}>
          Events you&apos;ve bookmarked will appear here.
        </p>
      </div>

      {/* Empty state */}
      <div className="gcard rounded-3xl p-16 text-center anim-border">
        <div className="text-5xl mb-5">🔖</div>
        <h3 className="h-md mb-3" style={{ color: '#F0EAFF' }}>No saved events yet</h3>
        <p className="font-body text-sm mb-7 max-w-xs mx-auto" style={{ color: 'rgba(240,234,255,0.35)' }}>
          Browse events and tap the bookmark icon to save them here for later.
        </p>
        <Link href="/events" className="btn-pri text-white font-semibold px-8 py-3.5 text-sm">
          Browse Events
        </Link>
      </div>
    </div>
  )
}
