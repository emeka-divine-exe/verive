import { createClient } from './client'

const client = createClient()

function fileExtension(file: File) {
  const name = file.name || 'upload'
  const parts = name.split('.')
  return parts.length > 1 ? `.${parts.pop()?.toLowerCase() || 'bin'}` : ''
}

export async function uploadPublicFile(bucket: string, folder: string, file: File) {
  const path = `${folder}/${crypto.randomUUID()}${fileExtension(file)}`
  const { error } = await client.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'application/octet-stream',
    })

  if (error) throw error

  const { data } = client.storage.from(bucket).getPublicUrl(path)
  return { path, url: data.publicUrl }
}

export async function deletePublicFile(bucket: string, path: string) {
  if (!path) return
  const { error } = await client.storage.from(bucket).remove([path])
  if (error) throw error
}

export function pathFromPublicUrl(url: string, bucket: string) {
  try {
    const parsed = new URL(url)
    const marker = `/storage/v1/object/public/${bucket}/`
    const index = parsed.pathname.indexOf(marker)
    if (index === -1) return ''
    return parsed.pathname.slice(index + marker.length)
  } catch {
    return ''
  }
}
