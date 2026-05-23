import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code  = searchParams.get('code')
  const next  = searchParams.get('next') ?? '/dashboard'

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
          await supabase.from('profiles').insert({
            id:        user.id,
            full_name: user.user_metadata?.full_name ?? '',
            email:     user.email,
            role:      user.user_metadata?.role ?? 'user',
            verified:  false,
          })
          return NextResponse.redirect(`${origin}/dashboard`)
        }

        // Redirect based on role
        if (profile.role === 'organizer' || profile.role === 'admin') {
          return NextResponse.redirect(`${origin}/organizer/dashboard`)
        }
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}
