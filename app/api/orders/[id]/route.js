import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/serverClient'

const db = () => getServiceClient()

export async function GET(req, { params }) {
  try {
    const { id } = params
    const { data, error } = await db().from('orders').select('*').eq('id', id).single()
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(data)
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json()
    const { id } = params
    const { data, error } = await db().from('orders').update(body).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}
