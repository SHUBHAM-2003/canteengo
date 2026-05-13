import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/serverSupabase'

export async function POST(req) {
  const formData = await req.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  
  const supabase = await createServerSupabase()
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  
  if (error) {
    return NextResponse.redirect(new URL('/login?error=Invalid credentials', req.url))
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()
  
  if (profile?.role === 'manager') {
    return NextResponse.redirect(new URL('/manager', req.url))
  }
  
  return NextResponse.redirect(new URL('/menu', req.url))
}

export async function GET(req) {
  const supabase = await createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()
  
  return NextResponse.json({ user: session.user, profile })
}
