import { createClient } from './client'
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  FORMAT_META,
  colorFromSeed,
  gradientFromSeed,
  makeInitials,
  type Category,
  type Event,
  type Format,
  type Organizer,
} from '@/lib/data'

type Tables = {
  profiles: {
    id: string
    full_name: string | null
    email: string | null
    role: string | null
    verified: boolean | null
    bio: string | null
    website: string | null
    twitter: string | null
    instagram: string | null
    avatar_url: string | null
    cover_url: string | null
    created_at: string | null
  }
  events: {
    id: string
    title: string | null
    description: string | null
    long_desc: string | null
    organizer_id: string | null
    category: string | null
    format: string | null
    date: string | null
    time: string | null
    location: string | null
    price: number | string | null
    ticket_url: string | null
    image_url: string | null
    capacity: number | null
    filled: number | null
    status: string | null
    featured: boolean | null
    created_at: string | null
  }
  organizer_metrics: {
    organizer_id: string
    total_reviews: number | null
    average_rating: number | null
    consistency_score: number | null
    trust_score: number | null
  }
}

type EventRow = Tables['events']
type ProfileRow = Tables['profiles']
type MetricsRow = Tables['organizer_metrics']

const CLIENT = createClient()

function safeCategory(value: string | null | undefined): Category {
  return CATEGORY_ORDER.includes(value as Category) ? (value as Category) : 'tech'
}

function safeFormat(value: string | null | undefined): Format {
  return value === 'online' || value === 'hybrid' || value === 'in-person'
    ? (value as Format)
    : 'in-person'
}

function formatDateLabel(value: string | null | undefined) {
  if (!value) return 'TBA'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

function formatTimeLabel(value: string | null | undefined) {
  return value?.trim() || 'All day'
}

function toNumber(value: number | string | null | undefined) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  const parsed = Number(value || 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function compactNumber(value: number) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

function buildPrice(value: number | string | null | undefined) {
  const amount = toNumber(value)
  return amount <= 0 ? 0 : amount
}

function buildBadge(row: EventRow, price: number) {
  if (row.featured) return 'featured' as const
  if (price <= 0) return 'free' as const
  return undefined
}

function eventToViewModel(row: EventRow, organizer?: ProfileRow | null): Event {
  const title = row.title?.trim() || 'Untitled Event'
  const category = safeCategory(row.category)
  const format = safeFormat(row.format)
  const organizerName = organizer?.full_name?.trim() || organizer?.email?.split('@')[0] || 'Organizer'
  const price = buildPrice(row.price)

  return {
    id: row.id,
    title,
    description: row.description || '',
    longDesc: row.long_desc || row.description || '',
    organizerId: row.organizer_id || '',
    organizer: organizerName,
    orgInitials: makeInitials(organizerName),
    orgColor: colorFromSeed(row.organizer_id || title),
    organizerVerified: organizer?.verified === true,
    date: formatDateLabel(row.date || row.created_at),
    dateRaw: row.date || row.created_at || '',
    time: formatTimeLabel(row.time),
    location: row.location || 'TBA',
    format,
    category,
    price,
    badge: buildBadge(row, price),
    status: (row.status as Event['status']) || 'published',
    featured: row.featured === true,
    capacity: row.capacity || 0,
    filled: row.filled || 0,
    speakers: [],
    photoQuery: `${title} event photo`,
    imageUrl: row.image_url,
    ticketUrl: row.ticket_url,
    createdAt: row.created_at || undefined,
  }
}

function profileToOrganizer(
  profile: ProfileRow,
  events: EventRow[],
  metrics?: MetricsRow | null,
): Organizer {
  const name = profile.full_name?.trim() || profile.email?.split('@')[0] || 'Organizer'
  const publishedEvents = events.filter((event) => event.status === 'published')
  const categories = Array.from(new Set(publishedEvents.map((event) => safeCategory(event.category)))).slice(0, 5) as Category[]
  const totalFilled = publishedEvents.reduce((sum, event) => sum + (event.filled || 0), 0)
  const totalCapacity = publishedEvents.reduce((sum, event) => sum + (event.capacity || 0), 0)
  const attendanceCount = metrics?.average_rating ? `${metrics.average_rating.toFixed(1)}★` : compactNumber(totalFilled || publishedEvents.length)
  const created = profile.created_at ? new Date(profile.created_at) : null

  return {
    id: profile.id,
    name,
    initials: makeInitials(name),
    bio: profile.bio || 'Verified event organizer on Verivent.',
    longBio: profile.bio || 'Verified event organizer on Verivent. This profile is managed through the organizer dashboard and Supabase.',
    type: profile.role === 'admin' ? 'Platform Admin' : 'Organizer',
    categories: categories.length ? categories : ['tech'],
    eventsCount: publishedEvents.length,
    attendees: attendanceCount,
    rating: metrics?.average_rating || 0,
    since: created ? created.getFullYear() : new Date().getFullYear(),
    website: profile.website || '',
    twitter: profile.twitter || '',
    instagram: profile.instagram || '',
    avatarColor: colorFromSeed(profile.id),
    coverColor: profile.cover_url ? `linear-gradient(135deg, rgba(79,124,255,0.42) 0%, rgba(123,63,228,0.18) 100%)` : gradientFromSeed(profile.id),
    coverQuery: `${name} organizer cover`,
    verified: profile.verified === true,
    avatarUrl: profile.avatar_url,
    coverUrl: profile.cover_url,
  }
}

async function fetchPublishedEvents() {
  const { data, error } = await CLIENT
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('fetchPublishedEvents', error)
    return [] as EventRow[]
  }

  return (data || []) as EventRow[]
}

async function fetchProfiles() {
  const { data, error } = await CLIENT
    .from('profiles')
    .select('*')
    .in('role', ['organizer', 'admin'])
    .order('created_at', { ascending: false })

  if (error) {
    console.error('fetchProfiles', error)
    return [] as ProfileRow[]
  }

  return (data || []) as ProfileRow[]
}

async function fetchMetrics() {
  const { data, error } = await CLIENT
    .from('organizer_metrics')
    .select('*')

  if (error) {
    console.error('fetchMetrics', error)
    return [] as MetricsRow[]
  }

  return (data || []) as MetricsRow[]
}

export async function getEvents() {
  const [events, profiles] = await Promise.all([fetchPublishedEvents(), fetchProfiles()])
  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]))
  return events.map((event) => eventToViewModel(event, profileMap.get(event.organizer_id || '')))
}

export async function getFeaturedEvents() {
  const events = await getEvents()
  const featured = events.filter((event) => event.featured || event.badge === 'featured')
  return featured.length ? featured.slice(0, 6) : events.slice(0, 6)
}

export async function getEventById(id: string) {
  const { data, error } = await CLIENT
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) {
    console.error('getEventById', error)
    return null
  }

  const { data: organizer } = await CLIENT
    .from('profiles')
    .select('*')
    .eq('id', data.organizer_id || '')
    .maybeSingle()

  return eventToViewModel(data as EventRow, organizer as ProfileRow | null)
}

export async function getEventsByOrganizer(organizerId: string, options?: { includeDrafts?: boolean }) {
  const query = CLIENT
    .from('events')
    .select('*')
    .eq('organizer_id', organizerId)

  if (!options?.includeDrafts) query.eq('status', 'published')

  const { data, error } = await query.order('featured', { ascending: false }).order('created_at', { ascending: false })

  if (error) {
    console.error('getEventsByOrganizer', error)
    return []
  }

  const { data: organizer } = await CLIENT
    .from('profiles')
    .select('*')
    .eq('id', organizerId)
    .maybeSingle()

  return (data || []).map((event) => eventToViewModel(event as EventRow, organizer as ProfileRow | null))
}

export async function getOrganizers() {
  const [profiles, events, metrics] = await Promise.all([
    fetchProfiles(),
    fetchPublishedEvents(),
    fetchMetrics(),
  ])

  const eventsByOrganizer = new Map<string, EventRow[]>()
  for (const event of events) {
    const organizerId = event.organizer_id || ''
    if (!organizerId) continue
    const existing = eventsByOrganizer.get(organizerId) || []
    existing.push(event)
    eventsByOrganizer.set(organizerId, existing)
  }

  const metricsByOrganizer = new Map(metrics.map((metric) => [metric.organizer_id, metric]))
  return profiles.map((profile) => profileToOrganizer(profile, eventsByOrganizer.get(profile.id) || [], metricsByOrganizer.get(profile.id)))
}

export async function getOrganizerById(id: string) {
  const [profiles, events, metrics] = await Promise.all([
    CLIENT.from('profiles').select('*').eq('id', id).maybeSingle(),
    CLIENT.from('events').select('*').eq('organizer_id', id).order('featured', { ascending: false }).order('created_at', { ascending: false }),
    CLIENT.from('organizer_metrics').select('*').eq('organizer_id', id).maybeSingle(),
  ])

  if (profiles.error || !profiles.data) {
    console.error('getOrganizerById profile', profiles.error)
    return null
  }

  const organizer = profileToOrganizer(
    profiles.data as ProfileRow,
    (events.data || []) as EventRow[],
    (metrics.data as MetricsRow | null) || null,
  )

  return organizer
}

export async function getOrganizerDirectoryEventCount(id: string) {
  const { count, error } = await CLIENT
    .from('events')
    .select('id', { count: 'exact', head: true })
    .eq('organizer_id', id)
    .eq('status', 'published')

  if (error) {
    console.error('getOrganizerDirectoryEventCount', error)
    return 0
  }

  return count || 0
}
