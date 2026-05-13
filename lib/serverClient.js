import { createClient } from '@supabase/supabase-js'

let cachedClient = null

export function getServiceClient() {
  if (cachedClient) return cachedClient
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceKey = process.env.SUPABASE_SERVICE_KEY || ''
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing SUPABASE_SERVICE_KEY or NEXT_PUBLIC_SUPABASE_URL environment variables')
  }
  
  cachedClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  
  return cachedClient
}
