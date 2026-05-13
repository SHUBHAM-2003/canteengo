import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createServerSupabase } from '@/lib/serverSupabase'

export async function GET() {
  const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}

export async function POST(req) {
  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  const { data, error } = await sb.from('banners').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function PUT(req) {
  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  const { id, ...updates } = body
  const { data, error } = await sb.from('banners').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
