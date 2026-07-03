import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createSupabaseJsClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  const server = createServerClient()
  const { data: { user } } = await server.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json(
      { error: 'Account deletion is not configured yet. Please contact support.' },
      { status: 500 },
    )
  }

  const admin = createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
  )
  const uid = user.id

  // Step 1 — remove this user's attendee-side activity.
  await admin.from('reviews').delete().eq('user_id', uid)
  await admin.from('event_attendees').delete().eq('user_id', uid)
  await admin.from('bookmarks').delete().eq('user_id', uid)

  // Step 2 — remove organizer-specific rows.
  await admin.from('verification_requests').delete().eq('organizer_id', uid)
  await admin.from('organizer_metrics').delete().eq('organizer_id', uid)

  // Step 3 — handle events this account posted as an organizer.
  const { data: ownEvents } = await admin
    .from('events').select('id').eq('organizer_id', uid)
  const eventIds = (ownEvents || []).map((e: { id: string }) => e.id)

  if (eventIds.length > 0) {
    const { error: detachErr } = await admin
      .from('events').update({ organizer_id: null }).eq('organizer_id', uid)

    if (detachErr) {
      await admin.from('reviews').delete().in('event_id', eventIds)
      await admin.from('event_attendees').delete().in('event_id', eventIds)
      await admin.from('bookmarks').delete().in('event_id', eventIds)
      await admin.from('events').delete().eq('organizer_id', uid)
    }
  }

  // Step 4 — profile row, now unblocked.
  const { error: profileErr } = await admin.from('profiles').delete().eq('id', uid)
  if (profileErr) {
    console.error('profile deletion blocked', profileErr)
    return NextResponse.json(
      { error: 'Could not fully remove your account. Please contact support.' },
      { status: 500 },
    )
  }

  // Step 5 — remove from Supabase Auth entirely.
  const { error: authErr } = await admin.auth.admin.deleteUser(uid)
  if (authErr) {
    console.error('auth user deletion failed', authErr)
    return NextResponse.json(
      { error: 'We could not delete your account. Please try again.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true })
}
