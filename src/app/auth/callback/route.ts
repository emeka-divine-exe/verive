import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code         = searchParams.get('code')
  const requestedRole = searchParams.get('role')

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check if profile exists, create if not (Google OAuth users)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!profile) {
          // `requestedRole` comes from the signup page's Attendee/Organizer selector,
          // carried through the OAuth redirect URL — this only ever applies to a
          // brand-new profile. It can never change the role of an existing account,
          // since this branch only runs when no profile row exists yet.
          const newRole = requestedRole === 'organizer' ? 'organizer' : (user.user_metadata?.role ?? 'user')

          await supabase.from('profiles').insert({
            id:        user.id,
            full_name: user.user_metadata?.full_name ?? '',
            email:     user.email,
            role:      newRole,
            verified:  false,
          })

          return NextResponse.redirect(
            newRole === 'organizer' ? `${origin}/organizers/dashboard` : `${origin}/dashboard`
          )
        }

        // Redirect based on role
        if (profile.role === 'organizer' || profile.role === 'admin') {
          return NextResponse.redirect(`${origin}/organizers/dashboard`)
        }
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}
