import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createSupabaseJsClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  // 1. Identify the caller from their real session cookie — never trust a client-passed user id.
  const server = createServerClient()
  const { data: { user } } = await server.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not set — cannot delete accounts.')
    return NextResponse.json(
      { error: 'Account deletion is not configured yet. Please contact support.' },
      { status: 500 },
    )
  }

  // 2. Admin client — service role key only, never exposed to the browser.
  const admin = createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
  )

  // Delete the profile row first in case there's no ON DELETE CASCADE from auth.users.
  await admin.from('profiles').delete().eq('id', user.id)

  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    console.error('account deletion failed', error)
    return NextResponse.json({ error: 'We could not delete your account. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
