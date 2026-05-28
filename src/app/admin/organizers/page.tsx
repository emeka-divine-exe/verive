export default function AdminOrganizersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-violet-300 mb-3">Organizer Management</p>
        <h1 className="text-4xl font-semibold text-white mb-3">Organizer Directory</h1>
        <p className="text-white/45 max-w-2xl">
          Moderate organizer onboarding, verification workflows, and public-facing organizer profiles.
        </p>
      </div>

      <div className="gcard rounded-3xl p-8">
        <ul className="space-y-4 text-white/55">
          <li>• Verification badge workflow</li>
          <li>• Organizer profile editing</li>
          <li>• Public organizer pages</li>
          <li>• Event ownership relationships</li>
          <li>• Role-based platform access</li>
        </ul>
      </div>
    </div>
  )
}
