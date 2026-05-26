export type Category = "tech" | "design" | "startup" | "career" | "community"
export type Format = "in-person" | "online" | "hybrid"

import { createClient } from './client'

const supabase = createClient()

export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*, profiles:organizer_id(full_name, verified, avatar_url)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data || []
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*, profiles:organizer_id(full_name, verified, avatar_url)')
    .eq('id', id)
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return data
}

export async function getOrganizers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['organizer'])

  if (error) {
    console.error(error)
    return []
  }

  return data || []
}
