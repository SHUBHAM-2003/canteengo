import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Browser/client-side client (used in 'use client' components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getSupabase() {
  return supabase
}
