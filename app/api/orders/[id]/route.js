import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/serverSupabase'

export async function GET(req, { params }) {
  const supabase = await createServerSupabase()
  const { id } = params
  const { data } = await supabase.from('orders').select('*').eq('id', id).single()
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req, { params }) {
  const supabase = await createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  const { id } = params
  const { data, error } = await supabase.from('orders').update(body).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
