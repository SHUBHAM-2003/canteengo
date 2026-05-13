import { createClient } from '@supabase/supabase-js'

let cachedClient = null

export function getServiceClient() {
  if (cachedClient) return cachedClient
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceKey = process.env.SUPABASE_SERVICE_KEY || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  // Prefer service key, fall back to anon key
  const key = serviceKey || anonKey
  
  if (!supabaseUrl || !key) {
    throw new Error('Missing Supabase credentials')
  }
  
  cachedClient = createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  
  return cachedClient
}
