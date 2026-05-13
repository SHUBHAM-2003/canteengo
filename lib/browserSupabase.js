import { createBrowserClient } from '@supabase/ssr'

// Browser client - stores auth in cookies so server can read session
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const browserSupabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
