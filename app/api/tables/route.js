import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data } = await supabase.from('tables').select('*').order('table_number')
  return NextResponse.json(data || [])
}

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await req.json()
  const { data, error } = await supabase.from('tables').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function PUT(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await req.json()
  const { id, ...updates } = body
  const { data, error } = await supabase.from('tables').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const { error } = await supabase.from('tables').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
