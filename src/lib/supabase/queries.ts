import { createClient } from './client'

const supabase = createClient()

export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .order('starts_at', { ascending: true })

  if (error) {
    console.error('getEvents error:', error)
    return []
  }

  return data || []
}

export async function getFeaturedEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('starts_at', { ascending: true })

  if (error) {
    console.error('getFeaturedEvents error:', error)
    return []
  }

  return data || []
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('getEventById error:', error)
    return null
  }

  return data
}

export async function getOrganizers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'organizer')

  if (error) {
    console.error('getOrganizers error:', error)
    return []
  }

  return data || []
}
