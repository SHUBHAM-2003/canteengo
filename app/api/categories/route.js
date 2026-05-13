import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data } = await supabase.from('categories').select('*').order('display_order')
  return NextResponse.json(data || [])
}

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await req.json()
  const { data, error } = await supabase.from('categories').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function PUT(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await req.json()
  const { id, ...updates } = body
  const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
