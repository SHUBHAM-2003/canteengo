import { createClient } from '@supabase/supabase-js'

// Server-side supabase client with service_role key
// Bypasses RLS - safe because this is only used in server-side API routes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceKey = process.env.SUPABASE_SERVICE_KEY || ''

export const serviceClient = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
})
