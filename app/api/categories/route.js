import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/serverClient'
import { createServerSupabase } from '@/lib/serverSupabase'

const db = () => getServiceClient()

export async function GET() {
  try {
    const { data } = await db().from('categories').select('*').order('display_order')
    return NextResponse.json(data || [])
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}

export async function POST(req) {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { data, error } = await db().from('categories').insert(body).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}

export async function PUT(req) {
  try {
    const body = await req.json()
    const { id, ...updates } = body
    const { data, error } = await db().from('categories').update(updates).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}
