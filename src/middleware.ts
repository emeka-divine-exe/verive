import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> }

const ORGANIZER_PATHS = [
  '/organizers/dashboard',
  '/organizers/events',
  '/organizers/media',
  '/organizers/settings',
  '/organizers/apply',
]


function redirectTo(url: string, request: NextRequest) {
  return NextResponse.redirect(new URL(url, request.url))
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const path = request.nextUrl.pathname

  if (path === '/organizer' || path.startsWith('/organizer/')) {
    const target = path.replace('/organizer', '/organizers')
    return redirectTo(target, request)
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (path === '/login' || path === '/signup') {
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_organizer')
        .eq('id', user.id)
        .maybeSingle()

      if (profile?.is_organizer || profile?.role === 'admin') {
        return redirectTo('/organizers/dashboard', request)
      }

      return redirectTo('/dashboard', request)
    }

    return supabaseResponse
  }

  if (path.startsWith('/dashboard')) {
    if (!user) return redirectTo('/login', request)
    return supabaseResponse
  }

  if (ORGANIZER_PATHS.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    if (!user) return redirectTo('/login', request)

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_organizer')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile || (!profile.is_organizer && profile.role !== 'admin')) {
      return redirectTo('/dashboard', request)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/organizers/:path*',
    '/organizer',
    '/organizer/:path*',
    '/login',
    '/signup',
  ],
}
