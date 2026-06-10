import { createClient } from './client'

/* ── Check if user attended this event ──────────────────────── */
export async function hasAttended(eventId: string, userId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('event_attendees')
    .select('event_id')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .maybeSingle()
  return data !== null
}

/* ── Check if user already reviewed this event ──────────────── */
export async function hasReviewed(eventId: string, userId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('reviews')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .maybeSingle()
  return data !== null
}

/* ── Mark attendance ─────────────────────────────────────────── */
export async function markAttended(eventId: string, userId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('event_attendees')
    .upsert({ event_id: eventId, user_id: userId }, { onConflict: 'event_id,user_id' })
  return { error }
}

/* ── Submit review (triggers algorithm automatically) ────────── */
export async function submitReview(payload: {
  event_id:        string
  user_id:         string
  speaker_score:   number
  execution_score: number
  networking_score:number
  value_score:     number
}) {
  const supabase = createClient()
  const { error } = await supabase.from('reviews').insert(payload)
  return { error }
}

/* ── Fetch review stats for one event ────────────────────────── */
export async function getEventReviewStats(eventId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('reviews')
    .select('speaker_score,execution_score,networking_score,value_score')
    .eq('event_id', eventId)

  if (!data || data.length === 0) return null

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length
  const count = data.length

  return {
    count,
    avgSpeaker:     avg(data.map(r => r.speaker_score)),
    avgExecution:   avg(data.map(r => r.execution_score)),
    avgNetworking:  avg(data.map(r => r.networking_score)),
    avgValue:       avg(data.map(r => r.value_score)),
    overallAvg:     avg(data.map(r =>
      (r.speaker_score + r.execution_score + r.networking_score + r.value_score) / 4
    )),
    worthAttending: Math.round(
      (data.filter(r => r.value_score >= 4).length / count) * 100
    ),
  }
}

/* ── Fetch organizer metrics ─────────────────────────────────── */
export async function getOrganizerMetrics(organizerId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('organizer_metrics')
    .select('*')
    .eq('organizer_id', organizerId)
    .maybeSingle()
  return data
}
