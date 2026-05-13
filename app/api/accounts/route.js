import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  return NextResponse.json(users || [])
}

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies })
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
