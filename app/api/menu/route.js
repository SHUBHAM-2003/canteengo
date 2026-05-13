import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/serverSupabase'

export async function GET() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.from('menu_items').select('*, categories(name)').order('category_id').order('name')
  return NextResponse.json(data || [])
}

export async function POST(req) {
  const supabase = await createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
  if (profile?.role !== 'manager') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  
  const body = await req.json()
  const { data, error } = await supabase.from('menu_items').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function PUT(req) {
  const supabase = await createServerSupabase()
  const body = await req.json()
  const { id, ...updates } = body
  const { data, error } = await supabase.from('menu_items').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(req) {
  const supabase = await createServerSupabase()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const { error } = await supabase.from('menu_items').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
