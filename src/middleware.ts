import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protected: user dashboard
  if (path.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protected: organizer pages
  if (path.startsWith('/organizer/dashboard') ||
      path.startsWith('/organizer/events') ||
      path.startsWith('/organizer/settings')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check organizer role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'organizer' && profile.role !== 'admin')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect logged-in users away from auth pages
  if (user && (path === '/login' || path === '/signup')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'organizer' || profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/organizer/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/organizer/dashboard/:path*',
    '/organizer/events/:path*',
    '/organizer/settings/:path*',
    '/login',
    '/signup',
  ],
}
