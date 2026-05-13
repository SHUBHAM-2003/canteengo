import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/serverClient'
import { createServerSupabase } from '@/lib/serverSupabase'

const db = () => getServiceClient()

export async function GET() {
  try {
    const { data } = await db().from('menu_items').select('*, categories(name)').order('id')
    return NextResponse.json(data || [])
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}

export async function POST(req) {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const body = await req.json()
    const { data, error } = await db().from('menu_items').insert(body).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}

export async function PUT(req) {
  try {
    const body = await req.json()
    const { id, ...updates } = body
    const { data, error } = await db().from('menu_items').update(updates).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const { error } = await db().from('menu_items').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}
