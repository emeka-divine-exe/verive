import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden grid-bg px-4">
      <div className="orb w-96 h-96 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'rgba(194,130,13,0.09)' }} />

      <div className="relative z-10 w-full flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <span className="font-display font-bold text-lg" style={{ color: 'var(--v-text)' }}>Verive</span>
          <span className="text-[0.55rem] font-body font-bold uppercase px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(194,130,13,0.14)', color: 'var(--v-gold)', letterSpacing: '0.1em' }}>
            Beta
          </span>
        </Link>

        <div className="auth-card text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--v-gold-dim)', border: '1px solid var(--v-gold-border)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ color: 'var(--v-gold)' }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h1 className="h-lg mb-3" style={{ color: 'var(--v-text)' }}>Verify your email</h1>
          <p className="font-body text-sm leading-relaxed mb-2" style={{ color: 'var(--v-muted)' }}>
            We&apos;ve sent a verification link to your email address.
          </p>
          <p className="font-body text-sm leading-relaxed mb-8" style={{ color: 'var(--v-muted)' }}>
            Click the link to activate your Verive account. Check your spam folder if you don&apos;t see it.
          </p>
          <Link href="/login" className="btn-ghost px-8 py-3.5 text-sm">Back to Login</Link>
        </div>
      </div>
    </div>
  )
}
