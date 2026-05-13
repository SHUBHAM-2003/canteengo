import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await req.json()
  const { data, error } = await supabase.from('banners').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function PUT(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await req.json()
  const { id, ...updates } = body
  const { data, error } = await supabase.from('banners').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
