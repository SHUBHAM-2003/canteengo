import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createServerSupabase } from '@/lib/serverSupabase'

export async function GET() {
  const { data } = await supabase.from('menu_items').select('*, categories(name)').order('category_id').order('name')
  return NextResponse.json(data || [])
}

export async function POST(req) {
  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'manager') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  
  const body = await req.json()
  const { data, error } = await sb.from('menu_items').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function PUT(req) {
  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  const { id, ...updates } = body
  const { data, error } = await sb.from('menu_items').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(req) {
  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const { error } = await sb.from('menu_items').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
