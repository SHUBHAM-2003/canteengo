import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/serverSupabase'

export async function GET() {
  const supabase = await createServerSupabase()
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  return NextResponse.json(users || [])
}

export async function POST(req) {
  const supabase = await createServerSupabase()
  const body = await req.json()
  
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true
  })
  
  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })
  
  const { data, error } = await supabase.from('profiles').insert({
    id: authData.user.id,
    name: body.name,
    role: body.role
  }).select().single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
