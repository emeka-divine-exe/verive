import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code         = searchParams.get('code')
  const requestedRole = searchParams.get('role') // 'organizer' if they picked that card on signup

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, is_organizer')
          .eq('id', user.id)
          .single()

        if (!profile) {
          // Brand new account. `role` only ever distinguishes admins from everyone
          // else now — organizer is a capability, not a role, so it lives in is_organizer.
          const wantsOrganizer = requestedRole === 'organizer'

          await supabase.from('profiles').insert({
            id:           user.id,
            full_name:    user.user_metadata?.full_name ?? '',
            email:        user.email,
            role:         'user',
            is_organizer: wantsOrganizer,
            verified:     false,
          })

          return NextResponse.redirect(
            wantsOrganizer ? `${origin}/organizers/dashboard` : `${origin}/dashboard`
          )
        }

        // Existing account, asking for organizer capability they don't have yet —
        // just grant it. One account, multiple roles: there's no conflict to block
        // anymore, signing up as "organizer" on an existing account simply turns
        // the capability on.
        if (requestedRole === 'organizer' && !profile.is_organizer) {
          await supabase.from('profiles').update({ is_organizer: true }).eq('id', user.id)
          return NextResponse.redirect(`${origin}/organizers/dashboard`)
        }

        // Otherwise, send them to whichever dashboard matches what they actually have.
        if (profile.is_organizer || profile.role === 'admin') {
          return NextResponse.redirect(`${origin}/organizers/dashboard`)
        }
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}
