import { createClient } from './client'
import { getEventById, getEventsByOrganizer, getOrganizerById } from './queries'
import { type Category, type Format } from '@/lib/data'

type OrganizerProfilePayload = {
  full_name?: string
  bio?: string
  website?: string
  twitter?: string
  instagram?: string
  avatar_url?: string | null
  cover_url?: string | null
  verified?: boolean
}

type OrganizerEventPayload = {
  title: string
  description: string
  longDesc?: string
  category: Category
  format: Format
  date: string
  time: string
  location: string
  price: number
  ticketUrl?: string
  imageUrl?: string
  status?: 'draft' | 'pending' | 'published' | 'rejected'
  featured?: boolean
  capacity?: number
  filled?: number
}

type OrganizerDashboard = Awaited<ReturnType<typeof getOrganizerById>> & {
  profile: Awaited<ReturnType<typeof getOrganizerById>>
  events: Awaited<ReturnType<typeof getEventsByOrganizer>>
  stats: {
    totalEvents: number
    publishedCount: number
    draftCount: number
    pendingCount: number
    featuredCount: number
    totalCapacity: number
    totalFilled: number
    fillRate: number
    averageFillRate: number
  }
  recentEvents: Awaited<ReturnType<typeof getEventsByOrganizer>>
}

const client = createClient()

export async function getOrganizerDashboard(userId: string) {
  const [profile, events, metrics] = await Promise.all([
    getOrganizerById(userId),
    getEventsByOrganizer(userId, { includeDrafts: true }),
    client
      .from('organizer_metrics')
      .select('*')
      .eq('organizer_id', userId)
      .maybeSingle(),
  ])

  const totalEvents = events.length
  const publishedCount = events.filter((event) => event.status === 'published').length
  const draftCount = events.filter((event) => event.status === 'draft').length
  const pendingCount = events.filter((event) => event.status === 'pending').length
  const featuredCount = events.filter((event) => event.featured).length
  const totalCapacity = events.reduce((sum, event) => sum + (event.capacity || 0), 0)
  const totalFilled = events.reduce((sum, event) => sum + (event.filled || 0), 0)
  const fillRate = totalCapacity > 0 ? Math.round((totalFilled / totalCapacity) * 100) : 0

  return {
    profile,
    metrics: metrics.data || null,
    events,
    stats: {
      totalEvents,
      publishedCount,
      draftCount,
      pendingCount,
      featuredCount,
      totalCapacity,
      totalFilled,
      fillRate,
      averageFillRate: totalEvents > 0 ? Math.round(totalFilled / Math.max(totalEvents, 1)) : 0,
    },
    recentEvents: events.slice(0, 5),
  }
}

export async function updateOrganizerProfile(userId: string, payload: OrganizerProfilePayload) {
  const { data, error } = await client
    .from('profiles')
    .update({
      full_name: payload.full_name,
      bio: payload.bio,
      website: payload.website,
      twitter: payload.twitter,
      instagram: payload.instagram,
      avatar_url: payload.avatar_url,
      cover_url: payload.cover_url,
      verified: payload.verified,
    })
    .eq('id', userId)
    .select('*')
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createOrganizerEvent(userId: string, payload: OrganizerEventPayload) {
  const { data, error } = await client
    .from('events')
    .insert({
      organizer_id: userId,
      title: payload.title,
      description: payload.description,
      long_desc: payload.longDesc || payload.description,
      category: payload.category,
      format: payload.format,
      date: payload.date,
      time: payload.time,
      location: payload.location,
      price: payload.price,
      ticket_url: payload.ticketUrl || null,
      image_url: payload.imageUrl || null,
      status: payload.status || 'draft',
      featured: payload.featured || false,
      capacity: payload.capacity || 0,
      filled: payload.filled || 0,
    })
    .select('*')
    .maybeSingle()

  if (error) throw error
  return data
}

export async function updateOrganizerEvent(eventId: string, userId: string, payload: OrganizerEventPayload) {
  const { data, error } = await client
    .from('events')
    .update({
      title: payload.title,
      description: payload.description,
      long_desc: payload.longDesc || payload.description,
      category: payload.category,
      format: payload.format,
      date: payload.date,
      time: payload.time,
      location: payload.location,
      price: payload.price,
      ticket_url: payload.ticketUrl || null,
      image_url: payload.imageUrl || null,
      status: payload.status || 'draft',
      featured: payload.featured || false,
      capacity: payload.capacity || 0,
    })
    .eq('id', eventId)
    .eq('organizer_id', userId)
    .select('*')
    .maybeSingle()

  if (error) throw error
  return data
}

export async function deleteOrganizerEvent(eventId: string, userId: string) {
  const { error } = await client
    .from('events')
    .delete()
    .eq('id', eventId)
    .eq('organizer_id', userId)

  if (error) throw error
}

export async function getOrganizerEventById(eventId: string, userId: string) {
  const { data, error } = await client
    .from('events')
    .select('*')
    .eq('id', eventId)
    .eq('organizer_id', userId)
    .maybeSingle()

  if (error) throw error
  return data ? await getEventById(eventId) : null
}
